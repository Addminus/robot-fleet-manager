import { useEffect, useState } from "react";

export const useClock = (intervalInMilliseconds: number) => {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalInMilliseconds);
    return () => clearInterval(timer);
  }, [intervalInMilliseconds]);

  return now;
};
