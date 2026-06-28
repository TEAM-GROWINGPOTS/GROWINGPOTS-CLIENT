# GROWINGPOTS-CLIENT — Agent Instructions

> 상세 컨벤션: [코딩](https://app.notion.com/p/1f932c07e25c821fa4b981c97a4ab60e) · [PR·커밋](https://app.notion.com/p/PR-d8d32c07e25c82c2bc7001b860476ad0) · [GitHub](https://app.notion.com/p/4c532c07e25c839cadf88174ac23f77a)

---

## Workflow

작업 요청 시 **아래 순서**를 따른다. 규칙 상세는 각 섹션을 참고.

| 단계 | 할 일 | 볼 섹션 |
|------|--------|---------|
| 1. 범위 파악 | 어디에 코드를 둘지 결정. 요청 범위만 수정 | **Project** > Folder Structure, **Boundaries** |
| 2. 기존 코드 확인 | 같은 feature의 api/components/hooks 패턴 따르기 | **Conventions**, Notion [코딩](https://app.notion.com/p/1f932c07e25c821fa4b981c97a4ab60e) |
| 3. 구현 | 명명·코드 스타일 준수. `app/`에는 라우팅만 | **Conventions** > Naming, Code Style |
| 4. 검증 | lint → build 실행, 오류 수정 | **Project** > Commands, **Done** |
| 5. 마무리 | 커밋·PR 컨벤션. ⚠️ 항목은 사용자 확인 후 | **Conventions** > Git, **Boundaries** |

---

## Project

### Overview

졸업까지 남은 이수·학점을 한 화면에서 보고, 수강 계획을 시뮬레이션하는 **비주얼 학사 플래너** 프론트엔드.

### Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (`strict: true`) |
| UI | React 19, Tailwind CSS 4 |
| State | Zustand |
| Package manager | **pnpm** |

> ky, Prettier, Husky/commitlint 등 — **Pending** 참고 (develop 머지 후).

### Folder Structure

```
src/
├── app/                         # URL·레이아웃만
│   └── (auth)/ (main)/ (onboarding)/
├── features/{feature-name}/
│   └── api/ components/ hooks/ types/
└── shared/                      # feature 간 공유
    └── api/ components/ hooks/ libs/ providers/ styles/ types/ utils/
```

| 폴더 | 목적 (WHY) |
|------|------------|
| `app/` | 라우팅·페이지 조립만. **비즈니스 로직·API 호출 금지** |
| `features/` | 도메인 단위 격리. **feature 간 직접 import 금지** |
| `shared/` | 2개 이상 feature에서 쓰는 코드만 |

- import — `@/*` alias. 상대 경로 `../../` 지양.

### Commands

```bash
pnpm install          # 의존성 설치
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드
pnpm start            # 빌드 결과 실행
pnpm lint             # ESLint
# pnpm format         # Prettier — Pending
```

테스트 프레임워크 미구축. 검증은 `pnpm lint` → `pnpm build`.

---

## Conventions

### Naming

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트명 | PascalCase | `LoginForm` |
| 파일명 | kebab-case, 소문자 시작 | `login-form.tsx`, `get-user.ts` |
| 폴더명 | kebab-case, 소문자 시작, 복수형 `s` | `components/`, `hooks/` |

**Next.js 예외:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.

### Code Style

포맷·import 정렬 — ESLint/Prettier (Pending).

#### 컴포넌트

- PascalCase, default export, 화살표 함수
- 최상단 Fragment (`<>...</>`), children 없으면 self-closing
- 의미 없는 `<div>` 지양 → 시맨틱 태그 (`header`, `main`, `section`, `nav` …)
- `'use client'` — 상태·이벤트·브라우저 API 필요할 때만

#### 타입

- PascalCase, `interface` 우선 (유니언·리터럴 등 불가피할 때만 `type`)
- Props → `*Props` (`HeaderProps`), type alias → `*Types` (`StatusTypes`)
- `any` 금지

#### 변수·함수

- 동사+명사: `get`, `create`, `check`, `convert`, `add`, `minus`, `filter`
- 이벤트 핸들러만 `handle` (`handleSubmitClick`)
- boolean 반환 유틸 → `is` (`isEmail`)

#### 패턴

- 배열 복사 → 스프레드 (`[...items]`)
- `for` 대신 `map` / `forEach`
- props·map 아이템 → 구조 분해 할당

#### 스타일

- Tailwind utility class 우선
- 전역 CSS — `src/shared/styles/globals.css`만

### Git

#### Commit

- 형식: `{type}: {subject}`
- type 소문자, 특수기호 X, 기능별로 작게 쪼개기
- 허용 type:

| type | 의미 |
|------|------|
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 설정·패키지 등 |
| `refactor` | 리팩터링 |
| `docs` | 문서 |
| `style` | 스타일 (로직 변경 없음) |
| `test` | 테스트 |
| `init` | 초기 세팅 |
| `ci` / `build` / `perf` / `revert` | CI·빌드·성능·되돌리기 |

- Notion `asset`/`type` — commitlint 반영 전 `chore`/`style` 등으로 대체

```
feat: 로그인 폼 UI 추가
fix: app 라우터 그룹 구조 수정
```

#### PR

- 한 PR = 한 기능
- 제목: `{Type}: {설명}` — Type 대문자 시작 (`Feat:`, `Fix:` …)
- 본문: Summary, Tasks, Describe
- 라벨 필수 (CI 자동화)
- approve 2명 이상 후 merge, 신뢰 머지 X

---

## Boundaries

Conventions에 없는 **판단·금지** 사항. 코드 스타일 중복은 **Conventions** 참고.

### ✅ Always

- `pnpm` 사용 (`npm`/`yarn` 금지).
- 변경 범위를 요청/task에 맞게 **최소화**.
- Workflow 4단계(검증) 실행 후 완료 보고.

### ⚠️ Ask First

- `pnpm add` (새 패키지)
- `shared/` 구조·공통 API 변경
- route group / `next.config.ts` / `tsconfig.json` 변경
- CI·Husky·commitlint 수정

### 🚫 Never

- `.env*` 생성·수정·커밋, secret 하드코딩
- `package-lock.json` 커밋, `.next/`·`node_modules/` 커밋
- feature 간 cross-import, `app/`에 비즈니스 로직
- `--no-verify`, 확인 없는 `git push` / force push
- 요청 범위 밖 대규모 리팩터링

---

## Done & Pending

### Definition of Done

- [ ] `pnpm lint` · `pnpm build` 통과
- [ ] **Conventions** (Naming · Code Style · Git) 준수
- [ ] **Boundaries** 위반 없음 (env/secret diff 없음)
- [ ] PR 제목·본문·라벨 (PR 제출 시)

### Pending (develop 머지 후 Project · Conventions · Commands에 반영)

| 항목 | 추가 내용 |
|------|-----------|
| ky / API | `fetch` 금지 → `@/shared/api/request`, `ApiResponse<T>` |
| ESLint / Prettier | import-sort, `pnpm format` |
| Git hooks | Husky, commitlint, lint-staged |
| PR 템플릿 | `.github/pull_request_template.md` |

---

## References

- [AGENTS.md](https://agents.md/) · `TEAM-GROWINGPOTS/GROWINGPOTS-CLIENT` · `CLAUDE.md` → `@AGENTS.md`
