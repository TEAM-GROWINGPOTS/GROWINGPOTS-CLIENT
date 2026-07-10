import { StudentInfo } from '@features/onboarding/analysis-result/student-info';
import { Button } from '@shared/components/button/button';

export default function AnalysisResultPage() {
  return (
    <div className="w-full px-120 pt-80 pb-40">
      <div className="mb-28 flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-title-sb-24 text-gray-900">분석 결과를 확인해 주세요</h1>
          <p className="text-body-r-16 text-gray-500">
            PDF에서 추출한 정보를 바탕으로 졸업 현황을 분석했습니다. 잘못된 정보가 있다면 수정해주세요!
          </p>
        </div>
        <Button label="편집하기" mode="secondary_outline" size="sm" />
      </div>

      <div className="h-231 w-248 shrink-0">
        <StudentInfo
          name="김경민"
          enrollmentStatus="재학 중"
          schoolName="경희대학교(국제캠퍼스)"
          departmentName="연극영화학과 영화트랙"
          studentNo="2023103101"
          gradeLevel={4}
          semester={1}
        />
      </div>
    </div>
  );
}
