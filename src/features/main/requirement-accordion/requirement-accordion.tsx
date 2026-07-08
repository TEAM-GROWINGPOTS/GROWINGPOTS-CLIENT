'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Badge, ClassCard } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

import { ProgressBar } from './progress-bar';

interface RequirementClass {
  id: string;
  department: string;
  name: string;
  tags: readonly string[];
  disabled?: boolean;
}

interface RequirementAccordionItem {
  id: string;
  category?: string;
  name: string;
  current: number;
  min: number;
  unit: '학점' | '과목';
  status: 'satisfied' | 'unsatisfied';
  classes?: readonly RequirementClass[];
  hasInfo?: boolean;
}

interface RequirementAccordionProps {
  items: readonly RequirementAccordionItem[];
  defaultValue?: string[];
  className?: string;
}

const statusLabelMap = {
  satisfied: '충족',
  unsatisfied: '미충족',
};

const getRequirementClassTags = (tags: readonly string[], disabled?: boolean) => {
  if (disabled) return [...tags];

  return tags.map((tag) => (tag === '수강학기' ? '이수학기' : tag));
};

export const RequirementAccordion = ({ items, defaultValue, className }: RequirementAccordionProps) => {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultValue} className={cn('flex w-509 flex-col gap-12', className)}>
      {items.map((item) => {
        const isSatisfied = item.status === 'satisfied';
        const hasProgress = item.min > 0;

        return (
          <Accordion.Item key={item.id} value={item.id} className="rounded-lg bg-gray-50 px-20 pt-12 pb-16">
            <Accordion.Header>
              {item.category && <p className="text-body-m-14 mb-3 text-gray-500">{item.category}</p>}

              <div className="flex items-center gap-8">
                <h3 className="text-title-sb-18 min-w-0 truncate text-gray-800">{item.name}</h3>

                {item.hasInfo && <Icon name="ic_information_outline" size={20} className="shrink-0 text-gray-300" />}

                <Badge size="xsmall" variant={isSatisfied ? 'secondary' : 'disabled'}>
                  {statusLabelMap[item.status]}
                </Badge>

                <p className="text-title-sb-18 ml-auto shrink-0 text-gray-700">
                  {item.current}
                  <span className="text-body-m-16 text-gray-400">
                    /{item.min}
                    {item.unit}
                  </span>
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
                <ProgressBar current={item.current} min={item.min} satisfied={isSatisfied} className="mt-12" />
              )}
            </Accordion.Header>

            <Accordion.Content>
              {item.classes && item.classes.length > 0 && (
                <ul className="mt-12 grid grid-cols-2 gap-8">
                  {item.classes.map((classItem) => (
                    <li key={classItem.id}>
                      <ClassCard
                        department={classItem.department}
                        title={classItem.name}
                        tags={getRequirementClassTags(classItem.tags, classItem.disabled)}
                        type={classItem.disabled ? 'disabled' : 'default'}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
