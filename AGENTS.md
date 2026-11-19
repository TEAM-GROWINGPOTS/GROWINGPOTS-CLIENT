# 🍟 GROWINGPOTS-CLIENT - Agent Instructions

---

## 📋 Workflow

작업 요청 시 **아래 순서대로 진행한다.** 상세 규칙은 각 섹션에 따른다.

| 단계         | 수행 내용                                                                                | 적용 섹션                                        |
| ------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1. 요청/범위 | 요청 범위를 파악한다. 코드를 둘 위치(`app` / `features` / `shared`)를 결정한다           | **Project** > Overview, Folder Structure         |
| 2. 조사      | 동일 feature/shared의 기존 패턴과 컨벤션을 먼저 살펴본다                                 | **Conventions**                                  |
| 3. 사전 확인 | 패키지 추가 / `shared/` 구조 변경 등 해당 시 **구현 전에** 사용자에게 먼저 묻는다        | **Boundaries** > Ask First                       |
| 4. 구현      | Naming / Code Style / API 규칙을 준수한다. Never 항목은 위반하지 않는다                  | **Conventions**, **Boundaries** > Never          |
| 5. 검증      | `pnpm lint` → `pnpm build`를 실행한다. **Definition of Done**을 충족하고 diff를 점검한다 | **Project** > Commands, **Done**, **Boundaries** |
| 6. 마무리    | 변경 사항을 요약해 완료를 보고한다. 커밋/PR은 **사용자가 요청할 때만** 작성한다          | **Conventions** > Git (Commit, Git hooks, PR)    |

---

## 📁 Project

### 🎯 Overview

졸업까지 남은 이수 및 학점을 한 화면에서 보고, 수강 계획을 시뮬레이션하는 **비주얼 학사 플래너**이다.

### 🛠️ Tech Stack

| 영역            | 기술                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router)                                                  |
| Language        | TypeScript 5 (`strict: true`)                                            |
| UI              | React 19, Tailwind CSS 4, Pretendard                                     |
| UI primitives   | Radix UI (Accordion, Dialog, Tooltip)                                    |
| Styling         | class-variance-authority (variant), clsx + tailwind-merge (`cn`)         |
| State           | Zustand 5 (`@shared/stores`)                                             |
| Server state    | TanStack Query v5 (+ Devtools)                                           |
| HTTP            | ky 2 (`@shared/apis/`)                                                   |
| Drag & Drop     | dnd-kit (학기 플래너 카드뷰)                                             |
| Graph           | React Flow `@xyflow/react` (학기 플래너 로드맵)                          |
| Carousel        | Embla Carousel + Autoplay (`@shared/components/carousel`)                |
| Toast           | sonner (`@shared/components/toast`)                                      |
| Animation       | lottie-react                                                             |
| Package manager | **pnpm 11** (`npm`/`yarn` 금지)                                          |
| Lint / Format   | ESLint 9, Prettier 3 (+ tailwind plugin), Husky, commitlint, lint-staged |
| CI / Deploy     | GitHub Actions (lint, build), Vercel                                     |

정확한 버전은 `package.json`을 따른다.

### 📂 Folder Structure

```
src/
├── app/
│   ├── layout.tsx, providers.tsx   # 루트 레이아웃/Provider
│   ├── page.tsx, not-found.tsx
│   ├── (auth)/                     # login/
│   ├── (main)/                     # graduation-dashboard/, semester-planner/, layout.tsx, error.tsx
│   ├── (onboarding)/               # onboarding/, analysis-result/
│   └── api/auth/                   # Route Handler: kakao/callback, logout, complete-onboarding
├── features/{feature-name}/        # auth, main(졸업요건 대시보드), onboarding, semester-planner
│   ├── apis/                       # API 함수
│   ├── hooks/                      # Query/Mutation 훅, 화면 로직 훅
│   ├── types/
│   ├── constants/, utils/
│   ├── contexts/                   # React Context (semester-planner)
│   ├── ui/                         # 화면 컴포넌트 (onboarding·auth는 단계/화면 폴더를 feature 바로 아래에 둔다)
│   └── index.ts                    # app에서 가져가는 컴포넌트 export
├── shared/
│   ├── apis/                       # kyClient, request, ENDPOINT, QUERY_KEY, auth-token, 공용 API 함수·타입
│   ├── components/                 # Icon, Button, Modal, Toast 등 공통 UI (컴포넌트별 폴더)
│   ├── constants/
│   ├── hooks/                      # 2개 이상 feature에서 쓰는 훅
│   ├── libs/                       # query-client
│   ├── stores/                     # Zustand 스토어 (auth-store, side-navigation-store)
│   ├── styles/                     # globals.css, tokens/, fonts
│   └── utils/                      # cn 등
├── types/                          # 전역 타입 선언 (kakao.d.ts)
└── proxy.ts                        # 로그인·온보딩 완료 여부에 따른 라우트 리다이렉트
public/svgs/                        # SVG 원본 → sprite 생성
```

| 폴더        | 규칙                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `app/`      | 라우팅/레이아웃/Provider만 조립한다. 비즈니스 로직/API 호출은 넣지 않는다                                             |
| `app/api/`  | 서버에서만 할 수 있는 처리(카카오 토큰 교환, 인증·온보딩 쿠키 설정/삭제)만 Route Handler로 둔다. `app/` 규칙의 예외다 |
| `features/` | 도메인 단위로 격리한다. feature 간 직접 import는 하지 않는다                                                          |
| `shared/`   | 2개 이상 feature에서 쓰는 코드만 둔다                                                                                 |

**Path alias:** `@app/`*, `@features/*`, `@shared/*`를 사용한다. 상대 경로 `../../`는 쓰지 않는다.

### ⌨️ Commands

```bash
pnpm install          # 의존성 설치
pnpm dev              # sprite 생성 후 개발 서버
pnpm build            # sprite 생성 후 프로덕션 빌드
pnpm start            # 빌드 결과 실행
pnpm lint             # ESLint
pnpm format           # Prettier 포맷
pnpm generate-sprite  # public/svgs → sprite (dev/build 전 자동 실행)
```

---

## 📐 Conventions

### 🏷️ Naming

| 대상          | 규칙                                           | 예시                            |
| ------------- | ---------------------------------------------- | ------------------------------- |
| 컴포넌트명    | PascalCase                                     | `LoginForm`                     |
| 파일명        | kebab-case, 소문자 시작                        | `login-form.tsx`, `get-user.ts` |
| 폴더명        | kebab-case, 소문자 시작, 복수형 `s`            | `components/`, `hooks/`         |
| 타입          | PascalCase. Props → `*Props`, alias → `*Types` | `HeaderProps`, `ButtonTypes`    |
| 변수/함수     | 동사+명사                                      | `getUser`, `createForm`         |
| 이벤트 핸들러 | `handle` 접두사                                | `handleSubmitClick`             |
| boolean 유틸  | `is` 접두사                                    | `isEmail`                       |

**Next.js 예외:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`는 그대로 둔다.

### ✍️ Code Style

ESLint + Prettier를 적용한다. import는 `simple-import-sort`로 정렬하고, 미사용 import는 제거한다.

#### ⚛️ 컴포넌트

- named export, 화살표 함수로 작성한다
- 최상단 Fragment (`<>...</>`)를 쓰고, children이 없으면 self-closing으로 작성한다
- 의미 없는 `<div>`는 쓰지 않고 시맨틱 태그를 사용한다 (`header`, `main`, `section`, `nav` …)
- `'use client'`는 상태/이벤트/브라우저 API가 필요할 때만 붙인다

#### 🔤 타입

- `interface`를 우선 사용한다 (유니언/리터럴 등 불가피할 때만 `type`)
- `any`는 쓰지 않는다

#### 🔁 패턴

- 배열 복사는 스프레드로 한다 (`[...items]`)
- `for` 대신 `map` / `forEach`를 쓴다
- props/map 아이템은 구조 분해 할당한다
- className 조합은 `@shared/utils/cn`을 쓴다

#### 🎨 스타일

- Tailwind utility class를 우선 사용한다
- 디자인 토큰은 `src/shared/styles/tokens/`의 `colors.css`, `typography.css`, `shadows.css`, `z-index.css`, `animations.css`를 따른다
- 전역 스타일 진입은 `src/shared/styles/globals.css`만 `@import`한다. 토큰 파일을 추가하면 `globals.css`에 `@import`로 등록한다
- SVG 아이콘은 `public/svgs/`에 추가한 뒤 `pnpm generate-sprite`를 실행하고, `<Icon name="..." />`로 사용한다

### 🌐 API / Data Fetching

#### 호출 흐름

```
컴포넌트 → 훅(useQuery/useMutation) → API 함수 → request → kyClient → /api/v1/* (같은 origin) → next.config.ts rewrites → 백엔드
```

- 브라우저에서 `kyClient`의 baseUrl은 `window.location.origin`이다. `/api/v1/*` 요청은 `next.config.ts`의 rewrites가 백엔드로 전달한다
- 서버 환경에서는 `NEXT_PUBLIC_API_BASE_URL`을 baseUrl로 쓴다

#### 규칙

- `fetch`를 직접 쓰지 않고 `@shared/apis/request` 래퍼(`get`/`post`/`put`/`patch`/`delete`)를 사용한다
- ky 인스턴스는 `@shared/apis/ky-client`의 `kyClient`만 쓴다
- 경로는 `@shared/apis/endpoint`의 `ENDPOINT`에 `/api/v1/`부터 전체 경로로 추가해서 쓴다. 문자열 경로를 직접 쓰지 않는다
- 쿼리 키는 `@shared/apis/query-key`의 `QUERY_KEY` 팩토리로 만든다
- 응답 타입은 `@shared/apis/type`의 `SuccessResponse<T>`(본문 없으면 `EmptySuccessResponse`)를 쓰고, API 함수에서 `.data`를 꺼내 반환한다
- API 함수와 훅은 feature의 `apis/`·`hooks/`에 두고, 2개 이상 feature에서 쓰면 `shared/apis/`·`shared/hooks/`로 옮긴다
- 서버 상태는 TanStack Query로 관리한다. `createQueryClient`(`@shared/libs/query-client`)가 query/mutation 에러를 전역 토스트로 처리하고, Provider는 `app/providers.tsx`에 둔다
- 에러 응답의 `code`/`message`가 필요하면 `@shared/apis/parse-api-error`의 `parseApiError`를 쓴다

```ts
export const getPlanner = async () => {
  const response = await request.get<SuccessResponse<PlannerResponse>>(ENDPOINT.PLANNER.ROOT);

  return response.data;
};
```

#### 인증

- Access Token은 JS 메모리(`@shared/apis/auth-token`)에, Refresh Token은 서버가 내려주는 HttpOnly 쿠키에 둔다
- `kyClient`가 요청마다 `Authorization` 헤더를 붙이고, 401이면 토큰을 재발급해 다시 요청한다. 재발급도 실패하면 `/api/auth/logout`으로 보낸다. API 함수에서 토큰을 직접 다루지 않는다
- 앱 시작 시 `useSessionRestore`(`app/providers.tsx`에서 호출)가 재발급으로 세션을 복구하고 `useAuthStore`의 인증 상태를 채운다

#### Route Handler · env

- `app/api/`의 Route Handler는 서버에서 실행되므로 `fetch`로 백엔드를 직접 호출한다. `fetch` 금지의 유일한 예외다
- env: `NEXT_PUBLIC_API_BASE_URL`(서버 환경의 kyClient baseUrl), `API_BASE_URL`(Route Handler 전용), `NEXT_PUBLIC_KAKAO_CLIENT_ID`(카카오 로그인)
- `.env.local`은 수정 및 커밋하지 않는다

### 🌿 Git

#### 🌱 Branch

- 이슈는 템플릿(`[Feat]`, `[Fix]`, `[Refactor]`)으로 만들고, 작업 브랜치는 `develop`에서 만든다
- 브랜치명은 `{type}/{작업-설명}/#{이슈번호}` 형식으로 쓴다 (예: `refactor/agents-md-update/#230`)
- 작업 브랜치의 PR은 `develop`으로 올린다. `main`은 배포 브랜치이며 `develop` → `main` PR로만 반영한다
- Vercel은 `main`(프로덕션)과 `develop`(dev)만 배포한다. 다른 브랜치는 빌드하지 않는다

#### 💬 Commit

사용자가 커밋을 요청했을 때만 작성한다. `git commit` / `git push`는 사용자 승인 후에만 실행한다.

- `{type}: {subject}` 형식으로 작성한다
- type은 소문자로 쓰고, 특수기호는 넣지 않으며, 기능별로 작게 쪼갠다
- 허용 type: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`, `ci`, `hotfix`, `init`, `revert`
- PR 제목은 대문자(`Docs:`)로 시작하지만 커밋 type은 소문자(`docs:`)다. 대문자로 쓰면 commitlint에서 막힌다
- Husky commitlint 검사를 통과시킨다

#### 🪝 Git hooks

커밋 시 Husky가 자동 실행한다. `--no-verify`로 우회하지 않는다.

| hook       | 시점                | 동작                                                                     |
| ---------- | ------------------- | ------------------------------------------------------------------------ |
| pre-commit | `git commit`        | staged `*.{ts,tsx}`에 lint-staged 실행 (eslint --fix → prettier --write) |
| commit-msg | 커밋 메시지 작성 후 | commitlint로 `{type}: {subject}` 형식 검사                               |

- hook은 **staged 파일만** 검사한다. 전체 검증은 Workflow **5단계**에서 `pnpm lint` / `pnpm build`를 직접 실행한다.
- `pnpm build`는 hook에 포함되지 않는다.
- `*.{ts,tsx}` 없이 커밋하면 lint-staged가 `could not find any staged files`를 출력한다. 오류가 아니다.

#### 📤 PR

사용자가 PR 작성을 요청했을 때만 작성한다.

- 제목은 `{Type}: {설명}` 형식으로 쓴다. Type은 대문자로 시작한다 (`Feat:`, `Fix:` …)
- 허용 Type: `Init`, `Feat`, `Fix`, `Refactor`, `Chore`, `Docs`, `Style`, `Test`, `Perf`, `Design`. PR Title Check 워크플로가 검사한다
- 라벨(타입·작성자)과 assignee는 GitHub Actions가 자동으로 붙인다
- 본문은 `.github/pull_request_template.md` 형식에 맞춰 작성한다

| 섹션         | 작성 기준                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------ |
| **Summary**  | 해당 브랜치 작업을 요약한다. 관련 Issue가 있으면 태그한다 (`> - #100`)                     |
| **Tasks**    | 브랜치에서 수행한 작업을 목록으로 적는다. 세분화 할수록 좋다                               |
| **Describe** | 수행한 작업을 설명한다. 맥락/의도/변경 이유를 포함하고, 자세히 그리고 이해가 쉽도록 적는다 |

#### ⚙️ CI

`develop`·`main` 대상 PR과 push마다 GitHub Actions가 `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build`를 실행한다 (Node 22). 로컬 검증과 같은 명령이므로 PR 전에 직접 통과시킨다.

---

## 🚧 Boundaries

Conventions에 없는 **판단/금지** 사항이다.

### ✅ Always

- `pnpm`을 사용한다 (`npm`/`yarn`은 쓰지 않는다)
- `@app/`*, `@features/*`, `@shared/*` alias를 사용한다
- 변경 범위를 요청/task에 맞게 **최소화**한다
- Workflow **5단계(검증)**를 실행한 뒤 완료를 보고한다

### ⚠️ Ask First

다음 항목은 **구현 전에** 사용자에게 먼저 묻는다.

- `pnpm add` (새 패키지)
- `shared/` 구조/공통 API 시그니처 변경
- route group / `next.config.ts` / `tsconfig.json` 변경
- CI / Husky / commitlint 수정

### 🚫 Never

- `.env`*를 생성/수정/커밋하거나 secret을 하드코딩한다
- `package-lock.json`, `.next/`, `node_modules/`를 커밋한다
- feature 간 cross-import를 하거나 `app/`에 비즈니스 로직을 넣는다
- `app/api/` Route Handler 밖에서 `fetch`를 직접 호출한다 (request 래퍼를 우회한다)
- `--no-verify`로 git hook을 우회한다
- 사용자 확인 없이 `git commit` / `git push` / force push를 한다
- 요청 범위 밖 대규모 리팩터링을 한다

---

## ✅ Done

### 🏁 Definition of Done

코드 변경이 포함된 작업은 완료 보고 전 아래를 모두 충족한다. Git hook 통과와 별개로 **전체** `pnpm lint` / `pnpm build`를 직접 실행한다.

- [ ] `pnpm lint` / `pnpm build`를 통과한다
- [ ] **Conventions** (Naming / Code Style / API / Git)를 준수한다
- [ ] **Boundaries**를 위반하지 않는다 (env/secret diff 없음)

**커밋/PR 요청 시** 추가로 충족한다.

- [ ] 커밋 메시지 형식 및 Git hooks를 통과한다
- [ ] PR 제출 시 제목/본문/라벨을 작성한다
