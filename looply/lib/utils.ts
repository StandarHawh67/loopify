import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: es
  });
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatCount(value: number) {
  if (value < 1000) return `${value}`;
  if (value < 1000000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `${(value / 1000000).toFixed(1)}M`;
}
