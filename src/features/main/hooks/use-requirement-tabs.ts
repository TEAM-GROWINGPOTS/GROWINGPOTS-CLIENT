import type { GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';
import { useMemo, useState } from 'react';

export const ALL_TAB_VALUE = 'ALL';
export const GE_TAB_VALUE = 'GE';
export const OTHERS_TAB_VALUE = 'OTHERS';

interface GraduationRequiredSectionSource {
  majorName: string | null;
  graduationRequired: GraduationResponse['graduationRequired'];
}

export interface RequirementSectionSource extends GraduationRequiredSectionSource {
  conditions: GraduationCondition[];
}

interface RequirementTab {
  value: string;
  label: string;
}

export interface RequirementSectionOption extends RequirementTab {
  sections: RequirementSectionSource[];
  shouldSort?: boolean;
}

const getRequirementSectionOptions = ({
  conditions,
  graduationRequired,
  sections,
}: GraduationResponse): RequirementSectionOption[] => {
  if (!sections) {
    return [
      {
        value: ALL_TAB_VALUE,
        label: '전체',
        sections: [
          {
            majorName: null,
            graduationRequired,
            conditions: conditions ?? [],
          },
        ],
      },
    ];
  }

  return [
    {
      value: ALL_TAB_VALUE,
      label: '전체',
      sections: [...sections.majors, sections.ge, sections.others],
      shouldSort: true,
    },
    ...sections.majors.map((section, index) => ({
      value: String(index),
      label: section.majorName,
      sections: [section],
    })),
    {
      value: GE_TAB_VALUE,
      label: '교양',
      sections: [sections.ge],
    },
    {
      value: OTHERS_TAB_VALUE,
      label: '기타',
      sections: [sections.others],
    },
  ];
};

export const useRequirementTabs = (data: GraduationResponse | null) => {
  const [selectedTab, setSelectedTab] = useState(ALL_TAB_VALUE);
  const sectionOptions = useMemo(() => (data ? getRequirementSectionOptions(data) : []), [data]);
  const selectedSectionOption = useMemo(
    () => sectionOptions.find(({ value }) => value === selectedTab) ?? sectionOptions[0],
    [sectionOptions, selectedTab],
  );
  const tabs = useMemo(() => sectionOptions.map(({ value, label }) => ({ value, label })), [sectionOptions]);

  return {
    tabs,
    selectedTab,
    setSelectedTab,
    selectedSectionOption,
  };
};
