import { Button, type ButtonMode } from '@shared/components/button/button';

const buttonModes: ButtonMode[] = ['primary_solid', 'primary_outline', 'secondary_solid', 'secondary_outline'];

const buttonSizes = [
  { label: 'Small', size: 'sm' },
  { label: 'Medium', size: 'md' },
  { label: 'Large', size: 'lg' },
] as const;

const PlusIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

// TODO: PR 머지 전 제거

export default function Page() {
  return (
    <div className="flex flex-col gap-48 p-32">
      {buttonSizes.map(({ label, size }) => (
        <div key={label} className="flex flex-col gap-32">
          <h1 className="title-sb-20 text-gray-900">{label}</h1>
          {buttonModes.map((mode) => (
            <section key={mode} className="flex flex-col gap-16">
              <h2 className="body-sb-16 text-gray-800">{mode}</h2>
              <div className="flex flex-wrap items-center gap-12">
                <Button size={size} mode={mode} icon={<PlusIcon />} label="button" />
                <Button size={size} mode={mode} icon={<PlusIcon />} label="button" disabled />
              </div>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}
