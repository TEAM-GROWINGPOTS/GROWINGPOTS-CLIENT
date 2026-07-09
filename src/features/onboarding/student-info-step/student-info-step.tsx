'use client';

import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SCHOOLS = [{ schoolId: 1, name: '경희대학교 국제캠퍼스' }];

const SCHOOL_OPTIONS = SCHOOLS.map((school) => ({
  value: `${school.schoolId}`,
  label: school.name,
}));

const DEPARTMENTS = [
  { departmentId: 101, schoolId: 1, college: '예술·디자인대학', name: '연극영화학과' },
  { departmentId: 102, schoolId: 1, college: '공과대학', name: '컴퓨터공학과' },
  { departmentId: 103, schoolId: 1, college: '공과대학', name: '소프트웨어학과' },
  { departmentId: 104, schoolId: 1, college: '공과대학', name: '산업공학과' },
];

const COLLEGE_OPTIONS = [...new Set(DEPARTMENTS.map((department) => department.college))].map((college) => ({
  value: college,
  label: college,
}));

const ADMISSION_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019];

const ADMISSION_YEAR_OPTIONS = ADMISSION_YEARS.map((year) => ({
  value: `${year}`,
  label: `${year}년(${String(year).slice(-2)}학번)`,
}));

export interface StudentInfoValues {
  schoolId: number;
  departmentId: number;
  admissionYear: number;
}

export const StudentInfoStep = () => {
  const router = useRouter();
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');

  const departmentOptions = DEPARTMENTS.filter((item) => item.college === college).map((item) => ({
    value: `${item.departmentId}`,
    label: item.name,
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
    if (!isComplete) return;
    router.push('/onboarding?step=pdf');
  };

  return (
    <>
      <p className="text-title-sb-24 mb-32 text-gray-900">
        정확한 졸업 현황 분석을 위해
        <br />
        기본 정보를 입력해 주세요
      </p>
      <div className="mb-60 flex flex-col gap-12">
        <Select options={SCHOOL_OPTIONS} value={school} onChange={handleSchoolChange} placeholder="학교" />
        <Select
          options={COLLEGE_OPTIONS}
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
        <Select options={ADMISSION_YEAR_OPTIONS} value={admissionYear} onChange={setAdmissionYear} placeholder="학번" />
      </div>
      <Button label="다음" size="lg" disabled={!isComplete} onClick={handleSubmit} />
    </>
  );
};
