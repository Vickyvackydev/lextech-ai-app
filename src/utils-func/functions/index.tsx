"use client";
import { useAppSelector } from "@/hooks";
import { selectDarkmode } from "@/states/slices/globalReducer";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useState } from "react";

interface CurrencyTypes {
  iso: string;
  slug: "NGN" | "USD";
}

export const formatCurrency = (currencyType: CurrencyTypes | any) =>
  new Intl.NumberFormat(currencyType.iso, {
    style: "currency",
    currency: currencyType.slug,
  });

export function formatTimeElapsed(date: string): string {
  const now = new Date();
  const createdDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  if (diffInSeconds < 60)
    return diffInSeconds === 1
      ? "1 second ago"
      : `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export function formatChatTime(date: string): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - messageDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export function groupMessagesByDate(
  messages: { createdAt: string }[]
): Record<string, any[]> {
  return messages.reduce((groups: Record<string, any[]>, message) => {
    const date = format(new Date(message.createdAt), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});
}

export function formatHeaderDate(dateString: string): string {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMMM");
  }
}

export const formatResponseToParagraphs = (response: string): string[] => {
  return response
    .split(/(?:###|\n\n)/)
    .map((paragraph) => paragraph.replace(/-|\*\*/g, "").trim())
    .filter((paragraph) => paragraph); // Remove empty paragraphs
};

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy: ", err);
      return false;
    }
  };
  return { copiedText, copyToClipboard };
}
