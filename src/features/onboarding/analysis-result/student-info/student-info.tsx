import type { StudentProfile } from '@shared/apis/types/student-profile';
import { Badge } from '@shared/components';

interface StudentInfoProps {
  profile: StudentProfile;
}

export const StudentInfo = ({ profile }: StudentInfoProps) => {
  const { name, enrollmentStatus, schoolName, departmentName, studentNo, gradeLevel, semester } = profile;

  const rows = [
    { label: '학부', value: departmentName },
    { label: '학번', value: studentNo },
    { label: '학년', value: `${gradeLevel}학년` },
    { label: '학기', value: `${semester}학기` },
  ];

  return (
    <section className="flex h-full flex-col justify-between rounded-lg bg-white p-20">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-10">
          <p className="text-title-sb-20 text-gray-700">{name}</p>
          <Badge size="xsmall" color="lime01">
            {enrollmentStatus}
          </Badge>
        </div>
        <span className="text-body-m-14 text-gray-400">{schoolName}</span>
      </div>
      <dl className="flex w-full flex-col gap-8">
        {rows.map(({ label, value }) => (
          <div key={label} className="text-body-m-16 flex h-24 w-full items-center gap-16">
            <dt className="shrink-0 whitespace-nowrap text-gray-400">{label}</dt>
            <dd className="min-w-0 flex-1 truncate text-right text-gray-600">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
