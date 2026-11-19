import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../reviewer-assignment.json', import.meta.url), 'utf8'));

const DAY_MS = 24 * 60 * 60 * 1000;

const countRecentReviews = async ({ github, context, candidateLogins }) => {
  const since = new Date(Date.now() - config.lookbackDays * DAY_MS);
  const reviewCounts = Object.fromEntries(candidateLogins.map((login) => [login, 0]));

  const pullRequests = await github.paginate(
    github.rest.pulls.list,
    { ...context.repo, state: 'all', sort: 'created', direction: 'desc', per_page: 100 },
    ({ data }, done) => {
      const recentPullRequests = data.filter(({ created_at }) => new Date(created_at) >= since);

      if (recentPullRequests.length < data.length) done();

      return recentPullRequests;
    },
  );

  const reviewersByPullRequest = await Promise.all(
    pullRequests
      .filter(({ number }) => number !== context.payload.pull_request.number)
      .map(async ({ number, user: author, requested_reviewers }) => {
        const reviews = await github.paginate(github.rest.pulls.listReviews, {
          ...context.repo,
          pull_number: number,
          per_page: 100,
        });

        return new Set([
          ...requested_reviewers.map(({ login }) => login),
          ...reviews.filter(({ user }) => user && user.login !== author.login).map(({ user }) => user.login),
        ]);
      }),
  );

  reviewersByPullRequest.forEach((reviewers) => {
    reviewers.forEach((login) => {
      if (login in reviewCounts) reviewCounts[login] += 1;
    });
  });

  return reviewCounts;
};

const assignReviewers = async ({ github, context, core }) => {
  const { number, user, requested_reviewers } = context.payload.pull_request;

  if (requested_reviewers.length > 0) {
    core.info('Reviewer already requested. Skip.');
    return;
  }

  const candidateLogins = config.reviewers
    .filter(({ login, enabled }) => enabled && login !== user.login)
    .map(({ login }) => login);

  const reviewCounts = await countRecentReviews({ github, context, candidateLogins });

  const selectedReviewers = candidateLogins
    .map((login) => ({ login, count: reviewCounts[login], tieBreaker: Math.random() }))
    .sort((a, b) => a.count - b.count || a.tieBreaker - b.tieBreaker)
    .slice(0, config.reviewerCount)
    .map(({ login }) => login);

  await github.rest.pulls.requestReviewers({
    ...context.repo,
    pull_number: number,
    reviewers: selectedReviewers,
  });

  core.info(`Requested reviewers: ${selectedReviewers.join(', ')}`);
};

export default assignReviewers;
