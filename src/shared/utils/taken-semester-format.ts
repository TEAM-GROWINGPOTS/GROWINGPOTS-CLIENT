const TERM_SHORT_LABELS: Record<string, string> = {
  '1학기': '1',
  '2학기': '2',
  여름학기: '여름',
  겨울학기: '겨울',
};

const TERMS_IN_YEAR_ORDER = ['1학기', '여름학기', '2학기', '겨울학기'];

const DEFAULT_YEARS_TO_SHOW = 8;

export const formatTakenSemester = (takenYear: number | null, semester: string | null) => {
  if (takenYear === null || semester === null) return '';
  return `${takenYear}-${TERM_SHORT_LABELS[semester] ?? semester}`;
};

export const getTakenSemesterValue = (takenYear: number | null, semester: string | null) =>
  takenYear === null || semester === null ? '' : `${takenYear}::${semester}`;

export const getTakenSemesterOptions = (admissionYear?: number, includeYears: number[] = []) => {
  const currentYear = new Date().getFullYear();
  const baseMinYear = admissionYear ?? currentYear - DEFAULT_YEARS_TO_SHOW + 1;

  const maxYear = Math.max(currentYear, ...includeYears);
  const minYear = Math.min(baseMinYear, ...includeYears);

  return Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index).flatMap((year) =>
    TERMS_IN_YEAR_ORDER.map((semester) => ({
      value: getTakenSemesterValue(year, semester),
      label: formatTakenSemester(year, semester),
    })),
  );
};

export const parseTakenSemesterValue = (value: string) => {
  const [yearPart, ...rest] = value.split('::');
  const semester = rest.join('::');
  const takenYear = Number(yearPart);

  if (!yearPart || !semester || Number.isNaN(takenYear)) return null;

  return { takenYear, semester };
};
