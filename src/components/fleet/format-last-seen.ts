const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
});

export const formatLastSeen = (milliseconds: number) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  if (seconds < 60) return relativeTimeFormat.format(-seconds, "second");
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return relativeTimeFormat.format(-minutes, "minute");
  return relativeTimeFormat.format(-Math.floor(minutes / 60), "hour");
};
