import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const delay = (time: number) => {
        setTimeout(() => {
          location.reload();
        }, time)
}

export const apiBack = () => {
  return process.env.NEXT_PUBLIC_API_BACKEND;
}