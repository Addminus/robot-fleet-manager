const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
});

// Note: give the last seen timestamp some "breathing room". Some robots do not report every second
const JUST_NOW_THRESHOLD_SECONDS = 5;

export const formatLastSeen = (milliseconds: number) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  if (seconds < JUST_NOW_THRESHOLD_SECONDS) return "just now";
  if (seconds < 60) return relativeTimeFormat.format(-seconds, "second");
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return relativeTimeFormat.format(-minutes, "minute");
  return relativeTimeFormat.format(-Math.floor(minutes / 60), "hour");
};
