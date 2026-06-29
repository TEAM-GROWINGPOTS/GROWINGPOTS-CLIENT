import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const isTypographyToken = (value: string) =>
  /^(display|title|body|caption)-/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isTypographyToken] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
