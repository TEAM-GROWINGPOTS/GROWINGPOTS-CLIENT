import { GraduationRequirementCard, type GraduationRequirementVariant } from './graduation-requirement-card';

interface GraduationRequirementItem {
  label: string;
  value: string;
  total?: string;
  checked?: boolean;
  variant?: GraduationRequirementVariant;
  valueClassName?: string;
}

interface GraduationRequirementResultProps {
  items: GraduationRequirementItem[];
}

export const GraduationRequirementResult = ({ items }: GraduationRequirementResultProps) => (
  <section className="rounded-lg bg-white p-20">
    <h2 className="text-body-sb-16 mb-12 text-gray-600">졸업 요건 분석 결과</h2>
    <div className="grid grid-cols-4 gap-8">
      {items.map(({ label, ...item }) => (
        <GraduationRequirementCard key={label} label={label} {...item} />
      ))}
    </div>
  </section>
);
