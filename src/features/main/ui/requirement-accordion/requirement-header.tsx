import {
  CURRENT_ONLY_CODES,
  HIDDEN_BADGE_CODES,
  MAJOR_TYPE_LABELS,
  REQUIREMENT_UNIT_LABELS,
} from '@features/main/constants/requirement';
import type { RequirementAccordionItem } from '@features/main/types/requirement';
import { ProgressBar } from '@features/main/ui';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge, Tooltip } from '@shared/components';
import Icon from '@shared/components/icon/icon';

interface RequirementHeaderProps {
  item: RequirementAccordionItem;
  hasInfo?: boolean;
  infoContent?: string;
}

export const RequirementHeader = ({ item, hasInfo = false, infoContent }: RequirementHeaderProps) => {
  const isSatisfied = item.satisfied;
  const isCurrentOnly = CURRENT_ONLY_CODES.has(item.code);
  const hasBadge = !HIDDEN_BADGE_CODES.has(item.code);
  const required = item.required ?? 0;
  const hasProgress = !isCurrentOnly && required > 0;
  const majorTypeLabel = item.majorType === 'ALL' || !item.majorType ? undefined : MAJOR_TYPE_LABELS[item.majorType];
  const unit = REQUIREMENT_UNIT_LABELS[item.unit];

  return (
    <Accordion.Header>
      {majorTypeLabel && <p className="text-body-m-14 mb-3 text-gray-500">{majorTypeLabel}</p>}

      <div className="flex items-center gap-8">
        <h3 className="text-title-sb-18 min-w-0 truncate text-gray-800">{item.name}</h3>

        {hasInfo && (
          <Tooltip
            variant="top-start"
            size="sm"
            content={infoContent ?? 'tooltip text'}
            trigger={
              <button
                type="button"
                aria-label={`${item.name} 안내 보기`}
                className="flex size-20 shrink-0 items-center justify-center"
              >
                <Icon name="ic_information_outline" size={20} className="text-gray-300" />
              </button>
            }
          />
        )}

        {hasBadge && (
          <Badge size="xsmall" variant={isSatisfied ? 'secondary' : 'disabled'}>
            {isSatisfied ? '충족' : '미충족'}
          </Badge>
        )}

        <p className="text-title-sb-18 ml-auto shrink-0 text-gray-700">
          {item.current}
          {isCurrentOnly ? (
            unit
          ) : (
            <span className="text-body-m-16 text-gray-400">
              /{required}
              {unit}
            </span>
          )}
        </p>

        <Accordion.Trigger
          aria-label={`${item.name} 상세 보기`}
          className="group flex size-24 shrink-0 cursor-pointer items-center justify-center"
        >
          <Icon name="ic_chevron_down" size={24} className="text-gray-500 group-data-[state=open]:hidden" />
          <Icon name="ic_chevron_up" size={24} className="hidden text-gray-500 group-data-[state=open]:block" />
        </Accordion.Trigger>
      </div>

      {hasProgress && (
        <ProgressBar current={item.current} required={required} satisfied={isSatisfied} className="mt-12" />
      )}
    </Accordion.Header>
  );
};
