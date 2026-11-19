import { ENDPOINT } from '@shared/apis/endpoint';
import { createCourse } from '@shared/test/factories/course';
import { createGraduationResponse } from '@shared/test/factories/graduation';
import { createSuccessResponse } from '@shared/test/factories/response';
import { http, HttpResponse } from 'msw';

export const getApiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

// 기본 성공 응답만 둔다. 에러 케이스는 테스트에서 server.use()로 오버라이드한다.
export const handlers = [
  http.get(getApiUrl(ENDPOINT.GRADUATION.STATUS), () =>
    HttpResponse.json(createSuccessResponse(createGraduationResponse())),
  ),
  http.get(getApiUrl(ENDPOINT.COURSES.LIST), () =>
    HttpResponse.json(
      createSuccessResponse({
        courses: [createCourse()],
        page: { page: 0, size: 20, totalElements: 1, hasNext: false },
      }),
    ),
  ),
];
