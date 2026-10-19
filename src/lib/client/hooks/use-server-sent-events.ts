import { useEffect, useEffectEvent, useState } from "react";

// Note: EventSource reconnects on its own. isConnected lets the UI tell a silent robot apart from a dropped connection
export const useServerSentEvents = <T>(
  url: string,
  onMessage: (data: T) => void,
) => {
  const [isConnected, setIsConnected] = useState(true);
  // Note: Always calls the latest callback without reopening the stream on every render
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const source = new EventSource(url);
    source.onopen = () => setIsConnected(true);
    source.onerror = () => setIsConnected(false);
    source.onmessage = (event) => handleMessage(JSON.parse(event.data) as T);
    return () => source.close();
  }, [url]);

  return { isConnected };
};
