import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(...input));
}

export function chatHrefContructor(id1: string, id2: string) {
  const sortedId = [id1, id2].sort();

  return `${sortedId[0]}--${sortedId[1]}`;
}
