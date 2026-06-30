interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  'aria-label'?: string;
}

const Icon = ({ name, size, width, height, className, 'aria-label': ariaLabel }: IconProps) => (
  <svg
    width={size ?? width ?? 24}
    height={size ?? height ?? 24}
    className={className}
    aria-label={ariaLabel}
    aria-hidden={ariaLabel ? undefined : 'true'}
    role={ariaLabel ? 'img' : undefined}
  >
    <use href={`/sprite.svg#${name}`} />
  </svg>
);

export default Icon;
