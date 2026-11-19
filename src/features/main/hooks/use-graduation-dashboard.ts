import { ALL_TAB_VALUE, GE_TAB_VALUE, OTHERS_TAB_VALUE } from '@features/main/constants/requirement';
import type { RequirementDetail, RequirementScrollRequest } from '@features/main/types/requirement';
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
import { useCallback, useMemo, useState } from 'react';

import { useGraduationCoursesQueries } from './use-graduation-courses-query';
import { useGraduationQuery } from './use-graduation-query';
import { useRequirementSection } from './use-requirement-section';

const EMPTY_REQUIREMENT_DETAILS: RequirementDetail[] = [];

export const useGraduationDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(ALL_TAB_VALUE);
  const [scrollRequests, setScrollRequests] = useState<Record<string, RequirementScrollRequest | null>>({});
  const scrollRequest = scrollRequests[selectedTab] ?? null;
  const handleScrollRequestChange = useCallback(
    (targetKey: string | null) => {
      setScrollRequests((previousRequests) => ({
        ...previousRequests,
        [selectedTab]: targetKey === null ? null : { targetKey },
      }));
    },
    [selectedTab],
  );
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
    details: EMPTY_REQUIREMENT_DETAILS,
  });
  const { shortcuts: selectedShortcuts, items } = useRequirementSection({
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
    scrollRequest,
    admissionYear: studentProfileQuery.data?.admissionYear,
    certs: allGraduationQuery.data?.certs,
    gpa: allGraduationQuery.data?.summary.gpa.current,
    isError,
    handleScrollRequestChange,
  };
};
