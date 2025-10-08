"use client";

export default function LocaleTime({ dateTime }: { dateTime: Date }) {
  return (
    <time dateTime={dateTime.toISOString()} suppressHydrationWarning>
      {dateTime.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </time>
  );
}
