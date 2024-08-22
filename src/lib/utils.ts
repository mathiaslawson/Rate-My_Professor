import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");