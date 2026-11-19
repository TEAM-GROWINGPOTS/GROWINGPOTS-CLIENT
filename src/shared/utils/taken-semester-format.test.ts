import { formatTakenSemester, parseTakenSemesterValue } from '@shared/utils/taken-semester-format';
import { describe, expect, it } from 'vitest';

describe('formatTakenSemester', () => {
  it('연도와 학기를 짧은 라벨로 표시한다', () => {
    expect(formatTakenSemester(2024, '1학기')).toBe('2024-1');
    expect(formatTakenSemester(2024, '여름학기')).toBe('2024-여름');
  });

  it('알 수 없는 학기는 원문 그대로 표시한다', () => {
    expect(formatTakenSemester(2024, '특별학기')).toBe('2024-특별학기');
  });

  it('연도나 학기가 없으면 빈 문자열을 반환한다', () => {
    expect(formatTakenSemester(null, '1학기')).toBe('');
    expect(formatTakenSemester(2024, null)).toBe('');
  });
});

describe('parseTakenSemesterValue', () => {
  it('값을 연도와 학기로 분리한다', () => {
    expect(parseTakenSemesterValue('2024::1학기')).toEqual({ takenYear: 2024, semester: '1학기' });
  });

  it('형식이 맞지 않으면 null을 반환한다', () => {
    expect(parseTakenSemesterValue('')).toBeNull();
    expect(parseTakenSemesterValue('2024')).toBeNull();
    expect(parseTakenSemesterValue('abc::1학기')).toBeNull();
  });
});
