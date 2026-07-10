import { Badge } from '@shared/components';

interface StudentInfoProps {
  name: string;
  enrollmentStatus: string;
  schoolName: string;
  departmentName: string;
  studentNo: string;
  gradeLevel: number;
  semester: number;
}

export const StudentInfo = ({
  name,
  enrollmentStatus,
  schoolName,
  departmentName,
  studentNo,
  gradeLevel,
  semester,
}: StudentInfoProps) => {
  const rows = [
    { label: '학부', value: departmentName },
    { label: '학번', value: studentNo },
    { label: '학년', value: `${gradeLevel}학년` },
    { label: '학기', value: `${semester}학기` },
  ];

  return (
    <section className="flex h-full w-full flex-1 flex-col rounded-lg bg-white p-20">
      <div className="flex w-full flex-1 flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-10">
            <span className="text-title-sb-20 text-gray-700">{name}</span>
            <Badge size="xsmall" color="lime01">
              {enrollmentStatus}
            </Badge>
          </div>
          <span className="text-body-m-14 text-gray-400">{schoolName}</span>
        </div>
        <dl className="flex w-full flex-col gap-8">
          {rows.map(({ label, value }) => (
            <div key={label} className="text-body-m-16 flex h-24 w-full gap-16 whitespace-nowrap">
              <dt className="flex-1 text-gray-400">{label}</dt>
              <dd className="text-gray-600">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
