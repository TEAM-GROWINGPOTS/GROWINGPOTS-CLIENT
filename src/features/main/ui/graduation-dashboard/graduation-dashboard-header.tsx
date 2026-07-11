'use client';

import type { CertType, GraduationCert } from '@shared/apis/types/graduation';
import { Tooltip } from '@shared/components';
import { cn } from '@shared/utils/cn';
import Image from 'next/image';

const badgeLabels: Record<CertType, string> = {
  THESIS: '졸업논문',
  GRADUATION_CERT: '졸업능력인증',
  TOPIK: '한국어능력인정',
  GPA: '졸업 평점',
};

const badgeImages: Record<CertType, { complete: string; disabled?: string }> = {
  THESIS: {
    complete: '/images/thesis_complete.svg',
    disabled: '/images/thesis_disabled.svg',
  },
  GRADUATION_CERT: {
    complete: '/images/skills_complete.svg',
    disabled: '/images/skills_disabled.svg',
  },
  TOPIK: {
    complete: '/images/topik_complete.svg',
    disabled: '/images/topik_disabled.svg',
  },
  GPA: {
    complete: '/images/grades_complete.svg',
  },
};

const badgeResultStyles: Record<GraduationCert['result'], string> = {
  PASS: '',
  FAIL: 'opacity-60',
  EXEMPT: '',
  NONE: '',
};

interface MainHomeHeaderProps {
  certs: GraduationCert[];
  gpa: number;
}

const getBadgeImageSrc = (certType: CertType, result: GraduationCert['result']) => {
  const image = badgeImages[certType];

  if (result === 'EXEMPT' || result === 'NONE') return image.disabled ?? image.complete;
  return image.complete;
};

const getBadgeTooltipContent = (certType: CertType, result: GraduationCert['result'], gpa: number) => {
  const label = badgeLabels[certType];

  if (certType === 'GPA') return `${label} ${gpa}`;
  if (result === 'PASS') return `${label} 통과`;
  if (result === 'EXEMPT') return `${label} 면제`;
  if (result === 'NONE') return `${label} 해당없음`;

  return `${label} 미통과`;
};

export const GraduationDashboardHeader = ({ certs, gpa }: MainHomeHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col gap-8">
        <Image src="/images/message.svg" width={40} height={40} alt="message" />
        <h1 className="text-title-sb-24 text-gray-700">내가 들은 과목을 요건별로 정리했어요</h1>
        <p className="text-body-m-16 text-gray-400">
          지금까지 채운 학점과 앞으로 들어야 할 과목을 한눈에 확인해 보세요
        </p>
      </div>

      <ul className="mr-13 flex items-center gap-4 p-8" aria-label="졸업 현황 요약">
        {Object.keys(badgeLabels).map((certType) => {
          const result = certs.find((cert) => cert.certType === certType)?.result ?? 'NONE';
          const tooltipContent = getBadgeTooltipContent(certType as CertType, result, gpa);

          return (
            <li key={certType}>
              <Tooltip
                variant="top-center"
                size="md"
                content={tooltipContent}
                trigger={
                  <button type="button" aria-label={tooltipContent} className="flex">
                    <Image
                      src={getBadgeImageSrc(certType as CertType, result)}
                      width={60}
                      height={60}
                      alt=""
                      className={cn(badgeResultStyles[result])}
                    />
                  </button>
                }
              />
            </li>
          );
        })}
      </ul>
    </header>
  );
};
