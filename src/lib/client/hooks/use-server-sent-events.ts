import { useEffect, useEffectEvent } from "react";

// Note: EventSource reconnects on its own. While it is down, no messages arrive and observedAt simply ages
export const useServerSentEvents = <T>(
  url: string,
  onMessage: (data: T) => void,
) => {
  // Note: Always calls the latest callback without reopening the stream on every render
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const source = new EventSource(url);
    source.onmessage = (event) => handleMessage(JSON.parse(event.data) as T);
    return () => source.close();
  }, [url]);
};
