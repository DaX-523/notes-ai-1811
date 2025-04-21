// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function formatTime(timestamp: string): string {
//   const date = new Date(timestamp);
//   const now = new Date();
//   const isToday = date.toDateString() === now.toDateString();

//   if (isToday) {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   }

//   const yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 1);
//   const isYesterday = date.toDateString() === yesterday.toDateString();

//   if (isYesterday) {
//     return "Yesterday";
//   }

//   return date.toLocaleDateString([], {
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//   });
// }

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
