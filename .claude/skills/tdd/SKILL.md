---
name: tdd
description: 이 레포에서 테스트를 작성하거나 수정할 때의 절차와 방법. 새 기능 구현, 버그 수정, 기존 코드 리팩터링, 테스트 추가, 또는 "TDD", "테스트", "red-green"이 언급될 때 사용한다.
---

# TDD

## 어떤 흐름으로 진행할까

| 작업               | 흐름                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| 새 기능            | Red → Green → Refactor                                                          |
| 버그 수정          | 버그를 재현하는 테스트(Red) → 수정(Green)                                       |
| 기존 코드 리팩터링 | 현재 동작을 기록하는 characterization test를 쓰고 통과를 확인한 뒤 리팩터링한다 |

- characterization test를 쓰다 버그를 찾아도 일단 현재 동작대로 기록하고 사용자에게 알린다. 수정은 리팩터링이 끝난 뒤 별도로 TDD로 진행한다.
- 다음은 단위 테스트 대상이 아니다. async Server Component(페이지), `@xyflow/react` 캔버스와 dnd-kit 드래그 자체(규칙 함수만 테스트한다), 레이아웃과 스타일.

## 사이클

한 번에 동작 하나만 다룬다. 테스트를 여러 개 몰아서 쓰지 않는다.

1. **Red**: 동작 하나를 테스트로 쓰고 `pnpm test:run <파일>`로 실패를 확인한다.
   - **실패 이유를 확인한다.** assertion 실패여야 Red다. import 에러, 타입 에러, 환경 에러는 Red가 아니다.
   - 새 파일이면 import 에러를 피하도록 빈 구현(예: `return 0`)을 먼저 둔다.
2. **Green**: 통과시키는 최소한의 코드만 쓴다.
3. **Refactor**: 통과 상태를 유지하며 중복과 이름을 정리하고, 다시 실행해 확인한다.
4. 다음 동작으로 넘어간다.

`pnpm test`(watch)는 끝나지 않으므로 쓰지 않는다.

vitest는 타입을 검사하지 않는다. 테스트가 통과해도 타입 에러가 있을 수 있으니 마무리할 때 `pnpm build`까지 실행한다.

## 대상별 작성법

### 순수 함수

```ts
import { formatTakenSemester } from '@shared/utils/taken-semester-format';
import { describe, expect, it } from 'vitest';

describe('formatTakenSemester', () => {
  it('연도나 학기가 없으면 빈 문자열을 반환한다', () => {
    expect(formatTakenSemester(null, '1학기')).toBe('');
  });
});
```

### TanStack Query 훅

`renderHookWithProviders`와 MSW를 쓴다.

```ts
const { result } = renderHookWithProviders(() => useCourseSearch({ keyword: '자료' }));

await waitFor(() => expect(result.current.isSuccess).toBe(true));
expect(result.current.data).toEqual([createCourse()]);
```

### 클라이언트 컴포넌트

`renderWithProviders`가 돌려주는 `user`로 사용자처럼 조작한다.

```tsx
const { user } = renderWithProviders(<GraduationCredits />);
await screen.findByText('60학점');

await user.click(screen.getByRole('button', { name: '다시 불러오기' }));

expect(await screen.findByText('90학점')).toBeInTheDocument();
```

전체 예시는 `src/shared/test/smoke.test.tsx`를 본다.

### `src/proxy.ts`

파일 첫 줄에 `// @vitest-environment node`를 쓰고, `NextRequest`를 만들어 직접 호출한다.

```ts
const response = proxy(new NextRequest('http://localhost:3000/semester-planner'));

expect(response.headers.get('location')).toBe('http://localhost:3000/login?redirect=%2Fsemester-planner');
```

## 테스트 유틸 (`src/shared/test/`)

| 유틸                                                  | 용도                                                                 |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `@shared/test/render`                                 | `renderWithProviders`, `renderHookWithProviders`                     |
| `@shared/test/query-client`                           | `createTestQueryClient` (재시도와 전역 toast 없음, 렌더 유틸이 사용) |
| `@shared/test/msw/server`                             | `server`. 에러 케이스는 `server.use()`로 오버라이드한다              |
| `@shared/test/msw/handlers`                           | 기본 성공 응답, `getApiUrl`                                          |
| `@shared/test/factories/{response,course,graduation}` | `createSuccessResponse`, `createCourse`, `createGraduationResponse`  |

```ts
server.use(http.get(getApiUrl(ENDPOINT.GRADUATION.STATUS), () => new HttpResponse(null, { status: 500 })));
```

`setup.ts`가 다음을 이미 처리하므로 테스트에서 반복하지 않는다.

- DOM cleanup, MSW 핸들러 초기화, Zustand store 초기화, mock 호출 기록 초기화
- `next/navigation`, `lottie-react` mock
- `ResizeObserver`, `IntersectionObserver`, `matchMedia`, `scrollIntoView` 폴리필

핸들러가 없는 요청은 에러가 된다. 새 API를 쓰는 테스트에는 핸들러를 추가한다. 여러 테스트에서 쓰는 성공 응답은 `handlers.ts`에, 한 테스트에서만 쓰는 응답은 `server.use()`에 둔다.

## mock 규칙

- API는 MSW로 mock한다. `fetch`, `kyClient`, `request`를 직접 mock하지 않는다.
- `vi.mock`은 모듈 경계(`next/navigation`, `lottie-react`처럼 jsdom에서 돌지 않거나 프레임워크가 제공하는 모듈)에만 쓴다. 테스트 대상의 내부 모듈은 mock하지 않는다.

## 쓰지 말아야 할 테스트

- 커버리지 수치를 올리기 위한 테스트
- 구현 세부사항(state 값, 내부 함수 호출)을 검증하는 테스트
- 동작을 설명하지 못하는 스냅샷 테스트

## 기존 테스트가 실패할 때

| 상황                       | 처리                                                                       |
| -------------------------- | -------------------------------------------------------------------------- |
| 구현이 틀려서 실패         | 테스트는 그대로 두고 구현을 고친다                                         |
| 요구사항이 변경됨          | 사용자에게 이유를 먼저 알리고 테스트를 수정(Red)한 뒤 구현을 고친다(Green) |
| 기능이 삭제됨              | 해당 테스트도 같은 변경에서 삭제한다                                       |
| 리팩터링마다 깨지는 테스트 | 구현 세부사항에 묶인 것이다. 동작 기준으로 다시 작성한다                   |
| 랜덤하게 실패(flaky)       | 원인을 고친다. 고칠 수 없으면 사용자에게 알린다. `skip`으로 두지 않는다    |
