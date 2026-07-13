'use client';

interface DropIndicatorLineProps {
  colX: number;
  y: number;
}

export const DropIndicatorLine = ({ colX, y }: DropIndicatorLineProps) => (
  <div className="absolute h-2 w-250 rounded-full bg-gray-700" style={{ transform: `translate(${colX}px, ${y}px)` }} />
);
