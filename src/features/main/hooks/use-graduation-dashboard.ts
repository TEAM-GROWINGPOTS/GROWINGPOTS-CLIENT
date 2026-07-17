import { ALL_TAB_VALUE, GE_TAB_VALUE, OTHERS_TAB_VALUE } from '@features/main/constants/requirement';
import {
  ALL_GRADUATION_PARAMS,
  getGraduationCoursesParams,
  getGraduationParams,
  getMajorTabValue,
  getProgressShortcuts,
  getRequirementDetailCodes,
  getVisibleRequirementItems,
} from '@features/main/utils/graduation-dashboard';
import { useStudentProfile } from '@shared/hooks/use-student-profile';
import { useMemo, useState } from 'react';

import { useGraduationCoursesQueries } from './use-graduation-courses-query';
import { useGraduationQuery } from './use-graduation-query';
import { useRequirementSection } from './use-requirement-section';

export const useGraduationDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(ALL_TAB_VALUE);
  const studentProfileQuery = useStudentProfile();
  const graduationParams = useMemo(() => getGraduationParams(selectedTab), [selectedTab]);
  const allGraduationQuery = useGraduationQuery(ALL_GRADUATION_PARAMS);
  const selectedGraduationQuery = useGraduationQuery(graduationParams);
  const graduationCoursesParams = useMemo(() => getGraduationCoursesParams(graduationParams), [graduationParams]);
  const detailCodes = useMemo(
    () => getRequirementDetailCodes(selectedGraduationQuery.data, selectedTab),
    [selectedGraduationQuery.data, selectedTab],
  );
  const requirementDetailsQuery = useGraduationCoursesQueries(detailCodes, graduationCoursesParams);
  const tabs = useMemo(() => {
    if (!studentProfileQuery.data) return [];

    return [
      { value: ALL_TAB_VALUE, label: '전체' },
      ...studentProfileQuery.data.majors.map(({ departmentName, studentMajorId }) => ({
        value: getMajorTabValue(studentMajorId),
        label: departmentName,
      })),
      { value: GE_TAB_VALUE, label: '교양' },
      { value: OTHERS_TAB_VALUE, label: '기타' },
    ];
  }, [studentProfileQuery.data]);
  const { shortcuts: allShortcuts } = useRequirementSection({
    data: allGraduationQuery.data ?? null,
    details: [],
  });
  const {
    shortcuts: selectedShortcuts,
    items,
    scrollTargetKey,
    handleShortcutClick,
  } = useRequirementSection({
    data: selectedGraduationQuery.data ?? null,
    details: requirementDetailsQuery.data,
  });
  const progressShortcuts = useMemo(
    () => getProgressShortcuts(selectedTab, allShortcuts, selectedShortcuts),
    [allShortcuts, selectedShortcuts, selectedTab],
  );
  const visibleItems = useMemo(() => getVisibleRequirementItems(selectedTab, items), [items, selectedTab]);
  const isError =
    studentProfileQuery.isError ||
    allGraduationQuery.isError ||
    selectedGraduationQuery.isError ||
    requirementDetailsQuery.isError;

  return {
    tabs,
    selectedTab,
    setSelectedTab,
    progressShortcuts,
    totalCredits: allGraduationQuery.data?.summary.totalCredits,
    items: visibleItems,
    scrollTargetKey,
    admissionYear: studentProfileQuery.data?.admissionYear,
    certs: allGraduationQuery.data?.certs,
    gpa: allGraduationQuery.data?.summary.gpa.current,
    isError,
    handleShortcutClick,
  };
};
