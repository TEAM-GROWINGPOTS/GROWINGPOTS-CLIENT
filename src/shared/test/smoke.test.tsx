import * as Tooltip from '@radix-ui/react-tooltip';
import { ENDPOINT } from '@shared/apis/endpoint';
import { useCourseSearch } from '@shared/hooks/use-course-search';
import { useGraduationStatus } from '@shared/hooks/use-graduation-status';
import { createCourse } from '@shared/test/factories/course';
import { createGraduationResponse } from '@shared/test/factories/graduation';
import { createSuccessResponse } from '@shared/test/factories/response';
import { getApiUrl } from '@shared/test/msw/handlers';
import { server } from '@shared/test/msw/server';
import { renderHookWithProviders, renderWithProviders } from '@shared/test/render';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const GraduationCredits = () => {
  const { data, isError, refetch } = useGraduationStatus();

  const handleRefetchClick = () => refetch();

  if (isError) return <p role="alert">불러오지 못했어요</p>;
  if (!data) return <p>불러오는 중</p>;

  return (
    <section>
      <p>{data.summary.totalCredits.current}학점</p>
      {/* Tooltip.Root는 Tooltip.Provider가 없으면 에러를 던진다 */}
      <Tooltip.Root>
        <Tooltip.Trigger onClick={handleRefetchClick}>다시 불러오기</Tooltip.Trigger>
      </Tooltip.Root>
    </section>
  );
};

describe('테스트 환경 스모크', () => {
  it('Provider 안에서 ky로 요청해 MSW 응답을 화면에 보여준다', async () => {
    renderWithProviders(<GraduationCredits />);

    expect(await screen.findByText('60학점')).toBeInTheDocument();
  });

  it('server.use로 바꾼 응답을 클릭 후 다시 불러와 보여준다', async () => {
    const { user } = renderWithProviders(<GraduationCredits />);
    await screen.findByText('60학점');

    server.use(
      http.get(getApiUrl(ENDPOINT.GRADUATION.STATUS), () =>
        HttpResponse.json(
          createSuccessResponse(
            createGraduationResponse({
              summary: {
                totalCredits: { current: 90, required: 130 },
                gpa: { current: 3.5, min: null },
                enrollmentStatus: '재학',
              },
            }),
          ),
        ),
      ),
    );
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));

    expect(await screen.findByText('90학점')).toBeInTheDocument();
  });

  it('HTTP 에러 응답이면 에러 상태가 된다', async () => {
    server.use(http.get(getApiUrl(ENDPOINT.GRADUATION.STATUS), () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<GraduationCredits />);

    expect(await screen.findByRole('alert')).toHaveTextContent('불러오지 못했어요');
  });

  it('훅의 검색 조건이 쿼리 스트링으로 전달되고 응답이 반환된다', async () => {
    let requestedUrl: URL | undefined;
    server.events.on('request:start', ({ request }) => {
      requestedUrl = new URL(request.url);
    });

    const { result } = renderHookWithProviders(() =>
      useCourseSearch({ keyword: '자료', divisionCategory: ['MAJOR_REQUIRED', 'FREE_GE'] }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([createCourse()]);
    expect(requestedUrl?.searchParams.get('keyword')).toBe('자료');
    expect(requestedUrl?.searchParams.getAll('divisionCategory')).toEqual(['MAJOR_REQUIRED', 'FREE_GE']);
  });
});
