import { STREAM_CHECK_INTERVAL_MS } from "@/lib/server/config";
import { getRobotById } from "@/lib/server/fleet-simulation-repository";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

const encoder = new TextEncoder();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getRobotById(id)) {
    return Response.json({ error: "Robot not found" }, { status: 404 });
  }

  let timer: ReturnType<typeof setInterval> | undefined;
  let lastSentObservedAt: number | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const sendLatestTelemetry = () => {
        const telemetry = getRobotById(id)?.telemetry;
        if (!telemetry || telemetry.observedAt === lastSentObservedAt) return;
        lastSentObservedAt = telemetry.observedAt;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`),
        );
      };
      sendLatestTelemetry();
      timer = setInterval(sendLatestTelemetry, STREAM_CHECK_INTERVAL_MS);
    },
    cancel() {
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
