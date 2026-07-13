'use client';

import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCreateStudentProfile } from '../hooks/use-create-student-profile';
import { useOnboardingOptions, useScopedOnboardingOptions } from '../hooks/use-onboarding-options';

export const StudentInfoStep = () => {
  const router = useRouter();
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');

  const schoolId = school ? Number(school) : undefined;

  const { data: options } = useOnboardingOptions();
  const { data: scopedOptions } = useScopedOnboardingOptions(schoolId);
  const { mutate: createStudentProfile, isPending } = useCreateStudentProfile();

  const schoolOptions = (options?.schools ?? []).map(({ schoolId: id, name }) => ({
    value: `${id}`,
    label: name,
  }));

  const admissionYearOptions = (options?.admissionYears ?? []).map((year) => ({
    value: `${year}`,
    label: `${year}년(${String(year).slice(-2)}학번)`,
  }));

  const departments = scopedOptions?.departments ?? [];

  const collegeOptions = [...new Set(departments.map(({ college: departmentCollege }) => departmentCollege))].map(
    (departmentCollege) => ({
      value: departmentCollege,
      label: departmentCollege,
    }),
  );

  const departmentOptions = departments
    .filter(({ college: departmentCollege }) => departmentCollege === college)
    .map(({ departmentId, name }) => ({
      value: `${departmentId}`,
      label: name,
    }));

  const isComplete = school !== '' && college !== '' && department !== '' && admissionYear !== '';

  const handleSchoolChange = (value: string) => {
    setSchool(value);
    setCollege('');
    setDepartment('');
  };

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setDepartment('');
  };

  const handleSubmit = () => {
    if (!isComplete || schoolId === undefined) return;

    createStudentProfile(
      { schoolId, departmentId: Number(department), admissionYear: Number(admissionYear) },
      {
        onSuccess: ({ studentProfileId }) => {
          router.push(`/onboarding?step=pdf&studentProfileId=${studentProfileId}`);
        },
      },
    );
  };

  return (
    <>
      <p className="text-title-sb-24 mb-32 text-gray-900">
        정확한 졸업 현황 분석을 위해
        <br />
        기본 정보를 입력해 주세요
      </p>
      <div className="mb-60 flex flex-col gap-12">
        <Select options={schoolOptions} value={school} onChange={handleSchoolChange} placeholder="학교" />
        <Select
          options={collegeOptions}
          value={college}
          onChange={handleCollegeChange}
          placeholder="단과대학"
          disabled={!school}
        />
        <Select
          options={departmentOptions}
          value={department}
          onChange={setDepartment}
          placeholder="소속학과"
          disabled={!college}
        />
        <Select options={admissionYearOptions} value={admissionYear} onChange={setAdmissionYear} placeholder="학번" />
      </div>
      <Button label="다음" size="lg" disabled={!isComplete || isPending} onClick={handleSubmit} />
    </>
  );
};
