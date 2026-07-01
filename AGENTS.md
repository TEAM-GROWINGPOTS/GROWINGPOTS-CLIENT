# GROWINGPOTS-CLIENT — Agent Instructions

> 상세 컨벤션: [코딩](https://app.notion.com/p/1f932c07e25c821fa4b981c97a4ab60e) · [PR·커밋](https://app.notion.com/p/PR-d8d32c07e25c82c2bc7001b860476ad0) · [GitHub](https://app.notion.com/p/4c532c07e25c839cadf88174ac23f77a)

---

## Workflow

작업 요청 시 **아래 순서**를 따른다. 규칙 상세는 각 섹션을 참고.


| 단계       | 할 일                                                                        | 볼 섹션                                                                                    |
| -------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1. 요청·범위 | 무엇을 할지 확인. **어디에** 둘지 결정 (`app` / `features` / `shared`)                   | **Project** > Overview, Folder Structure                                                |
| 2. 조사    | 같은 feature·shared 기존 패턴·컨벤션·Notion 확인                                      | **Conventions**, Notion [코딩](https://app.notion.com/p/1f932c07e25c821fa4b981c97a4ab60e) |
| 3. 사전 확인 | 패키지 추가·`shared/` 구조 변경 등 해당 시 **구현 전** 사용자에게 확인                            | **Boundaries** > Ask First                                                              |
| 4. 구현    | Naming · Code Style · API 규칙 준수. Never 위반 금지                               | **Conventions**, **Boundaries** > Never                                                 |
| 5. 검증    | `pnpm lint` → `pnpm build` + **Definition of Done** + diff(env·범위 밖 파일 없음) | **Project** > Commands, **Done**, **Boundaries**                                        |
| 6. 마무리   | 커밋·PR (Git). `git push`는 사용자 확인 후                                          | **Conventions** > Git                                                                   |


---

## Project

### Overview

졸업까지 남은 이수·학점을 한 화면에서 보고, 수강 계획을 시뮬레이션하는 **비주얼 학사 플래너** 프론트엔드.

### Tech Stack


| 영역              | 기술                                                   |
| --------------- | ---------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                              |
| Language        | TypeScript 5 (`strict: true`)                        |
| UI              | React 19, Tailwind CSS 4, Pretendard                 |
| State           | Zustand                                              |
| Server state    | TanStack Query v5                                    |
| HTTP            | ky (`@shared/apis/`)                                 |
| Package manager | **pnpm** (`npm`/`yarn` 금지)                           |
| Lint / Format   | ESLint 9, Prettier 3, Husky, commitlint, lint-staged |


### Folder Structure

```
src/
├── app/
│   ├── layout.tsx, providers.tsx   # 루트 레이아웃·Provider
│   └── (auth)/ (main)/ (onboarding)/
├── features/{feature-name}/
│   └── api/ components/ hooks/ types/
└── shared/
    ├── apis/          # kyClient, request, API 타입
    ├── components/    # Icon, Button 등 공통 UI
    ├── libs/          # query-client 등
    ├── styles/        # globals.css, tokens/, fonts
    └── utils/         # cn 등
public/svgs/           # SVG 원본 → sprite 생성
```


| 폴더          | 목적                                           |
| ----------- | -------------------------------------------- |
| `app/`      | 라우팅·레이아웃·Provider 조립만. **비즈니스 로직·API 호출 금지** |
| `features/` | 도메인 단위 격리. **feature 간 직접 import 금지**        |
| `shared/`   | 2개 이상 feature에서 쓰는 코드                        |


**Path alias:** `@app/`*, `@features/*`, `@shared/*` (상대 경로 `../../` 지양)

### Commands

```bash
pnpm install          # 의존성 설치
pnpm dev              # sprite 생성 후 개발 서버
pnpm build            # sprite 생성 후 프로덕션 빌드
pnpm start            # 빌드 결과 실행
pnpm lint             # ESLint
pnpm format           # Prettier 포맷
pnpm generate-sprite  # public/svgs → sprite (dev/build 전 자동 실행)
```

테스트 프레임워크 미구축. 검증은 Workflow **5단계** — `pnpm lint` → `pnpm build` + Definition of Done.

**Git hooks:** pre-commit → lint-staged (eslint --fix, prettier). commit-msg → commitlint.

---

## Conventions

### Naming


| 대상    | 규칙                          | 예시                              |
| ----- | --------------------------- | ------------------------------- |
| 컴포넌트명 | PascalCase                  | `LoginForm`                     |
| 파일명   | kebab-case, 소문자 시작          | `login-form.tsx`, `get-user.ts` |
| 폴더명   | kebab-case, 소문자 시작, 복수형 `s` | `components/`, `hooks/`         |


**Next.js 예외:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.

### Code Style

ESLint + Prettier 적용. import는 `simple-import-sort`, 미사용 import 제거.

#### 컴포넌트

- PascalCase, default export, 화살표 함수
- 최상단 Fragment (`<>...</>`), children 없으면 self-closing
- 의미 없는 `<div>` 지양 → 시맨틱 태그 (`header`, `main`, `section`, `nav` …)
- `'use client'` — 상태·이벤트·브라우저 API 필요할 때만

#### 타입

- PascalCase, `interface` 우선 (유니언·리터럴 등 불가피할 때만 `type`)
- Props → `*Props` (`HeaderProps`, `IconProps`), type alias → `*Types`
- `any` 금지

#### 변수·함수

- 동사+명사: `get`, `create`, `check`, `convert`, `add`, `minus`, `filter`
- 이벤트 핸들러만 `handle` (`handleSubmitClick`)
- boolean 반환 유틸 → `is` (`isEmail`)

#### 패턴

- 배열 복사 → 스프레드 (`[...items]`)
- `for` 대신 `map` / `forEach`
- props·map 아이템 → 구조 분해 할당
- className 조합 → `@shared/utils/cn`

#### 스타일

- Tailwind utility class 우선
- 디자인 토큰 — `src/shared/styles/tokens/` (`colors.css`, `typography.css`)
- 전역 진입 — `src/shared/styles/globals.css`만 `@import`
- SVG 아이콘 — `public/svgs/` 추가 후 `pnpm generate-sprite`, `<Icon name="..." />` 사용

### API · Data Fetching

- `**fetch` 직접 사용 금지** → `@shared/apis/request` 래퍼
- ky 인스턴스 — `@shared/apis/ky-client`의 `kyClient`만
- 응답 타입 — `@shared/apis/type`의 `ApiResponse<T>` 패턴
- 서버 상태 — TanStack Query. `createQueryClient`는 `@shared/libs/query-client`, Provider는 `app/providers.tsx`
- env: `NEXT_PUBLIC_API_BASE_URL` (`.env.local` — **수정·커밋 금지**)

### Git

#### Commit

- 형식: `{type}: {subject}`
- type 소문자, 특수기호 X, 기능별로 작게 쪼개기
- Husky commitlint 검사 통과


| type                               | 의미             |
| ---------------------------------- | -------------- |
| `feat`                             | 기능 추가          |
| `fix`                              | 버그 수정          |
| `chore`                            | 설정·패키지 등       |
| `refactor`                         | 리팩터링           |
| `docs`                             | 문서             |
| `style`                            | 스타일 (로직 변경 없음) |
| `test`                             | 테스트            |
| `init`                             | 초기 세팅          |
| `ci` / `build` / `perf` / `revert` | CI·빌드·성능·되돌리기  |


- Notion `asset`/`type` — commitlint 반영 전 `chore`/`style` 등으로 대체

```
feat: 로그인 폼 UI 추가
fix: app 라우터 그룹 구조 수정
```

#### PR

- 한 PR = 한 기능
- 제목: `{Type}: {설명}` — Type 대문자 시작 (`Feat:`, `Fix:` …)
- 본문: `.github/pull_request_template.md` — Summary, Tasks, Describe
- 라벨 필수 (CI 자동화)
- approve 2명 이상 후 merge, 신뢰 머지 X

---

## Boundaries

Conventions에 없는 **판단·금지** 사항.

### ✅ Always

- `pnpm` 사용 (`npm`/`yarn` 금지).
- `@app/`* · `@features/*` · `@shared/*` alias 사용.
- 변경 범위를 요청/task에 맞게 **최소화**.
- Workflow **5단계(검증)** 실행 후 완료 보고.

### ⚠️ Ask First

- `pnpm add` (새 패키지)
- `shared/` 구조·공통 API 시그니처 변경
- route group / `next.config.ts` / `tsconfig.json` 변경
- CI·Husky·commitlint 수정

### 🚫 Never

- `.env`* 생성·수정·커밋, secret 하드코딩
- `package-lock.json` 커밋, `.next/`·`node_modules/` 커밋
- feature 간 cross-import, `app/`에 비즈니스 로직
- `fetch` 직접 호출 (request 래퍼 우회)
- `--no-verify`로 git hook 우회
- 확인 없는 `git push` / force push
- 요청 범위 밖 대규모 리팩터링

---

## Done

### Definition of Done

- [ ] `pnpm lint` · `pnpm build` 통과
- [ ] **Conventions** (Naming · Code Style · API · Git) 준수
- [ ] **Boundaries** 위반 없음 (env/secret diff 없음)
- [ ] PR 제목·본문·라벨 (PR 제출 시)

---

## References

- [AGENTS.md](https://agents.md/) · `TEAM-GROWINGPOTS/GROWINGPOTS-CLIENT` · `CLAUDE.md` → `@AGENTS.md`

