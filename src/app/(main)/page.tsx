import { Tooltip, type TooltipSize, type TooltipVariant } from '@shared/components';

const variants: TooltipVariant[] = ['top-center', 'top-start', 'bottom-center', 'bottom-start'];
const sizes: TooltipSize[] = ['sm', 'md'];

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-32">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-8">
          <p className="text-sm font-bold text-gray-500">size: {size}</p>
          <div className="flex gap-16">
            {variants.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-4">
                <p className="text-xs text-gray-400">{variant}</p>
                <Tooltip
                  trigger={<button className="rounded bg-gray-200 px-12 py-8 text-sm">hover me</button>}
                  content="옹심이들아 팟팅 아자아자 행복앱잼"
                  variant={variant}
                  size={size}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
