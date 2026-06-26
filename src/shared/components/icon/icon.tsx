interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

const Icon = ({ name, size, width, height, className }: IconProps) => (
  <svg
    width={size ?? width ?? 24}
    height={size ?? height ?? 24}
    className={className}
    aria-hidden="true"
  >
    <use href={`/sprite.svg#${name}`} />
  </svg>
);

export default Icon;
