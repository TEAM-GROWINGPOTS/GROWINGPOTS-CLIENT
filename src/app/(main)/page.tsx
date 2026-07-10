'use client';

import { NodeCard } from '@features/semester-planner/node-view';
import { PLANNER_NODE_MOCK } from '@features/semester-planner/node-view';

export default function Page() {
  const { completedTerms, plannedTerms } = PLANNER_NODE_MOCK;

  return (
    <div className="flex flex-wrap gap-16 p-32">
      {/* 이수완료 / 이수 중 */}
      {completedTerms.map((term) => (
        <NodeCard
          key={term.plannerTermVersionId}
          status={term.status}
          isSelected={true}
          termName={term.name}
          folderName={term.name}
          totalCredit={term.totalCredit}
          courses={term.courses.map((c) => ({
            id: c.studentCourseId,
            courseName: c.courseName,
            divisionCategory: c.divisionCategory,
            divisionName: c.divisionName,
          }))}
        />
      ))}

      {/* 이수 예정 — 버전별 카드 */}
      {plannedTerms.map((term) =>
        term.versions.map((version) => (
          <NodeCard
            key={version.plannerTermVersionId}
            status="PLANNED"
            isSelected={version.isSelected}
            termName={`${term.yearLevel}학년 ${term.semester}학기`}
            folderName={version.name}
            totalCredit={version.totalCredit}
            courses={version.courses.map((c) => ({
              id: c.plannerVersionItemId,
              courseName: c.courseName,
              divisionCategory: c.divisionCategory,
              divisionName: c.divisionName,
            }))}
            onMenuClick={() => console.log('menu', version.plannerTermVersionId)}
          />
        )),
      )}
    </div>
  );
}
