import { RequirementCard, type RequirementCardProps } from './requirement-card';

interface GraduationResultProps {
  items: RequirementCardProps[];
}

export const GraduationResult = ({ items }: GraduationResultProps) => (
  <section className="rounded-lg bg-white p-20">
    <h2 className="text-body-sb-16 mb-12 text-gray-600">졸업 요건 분석 결과</h2>
    <div className="grid grid-cols-5 gap-8">
      {items.map((item, index) => (
        <RequirementCard key={`${item.label}-${index}`} {...item} />
      ))}
    </div>
  </section>
);
