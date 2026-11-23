import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() joins Tailwind class names together and removes conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
