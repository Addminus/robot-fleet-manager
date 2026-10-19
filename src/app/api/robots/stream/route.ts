import { STREAM_CHECK_INTERVAL_MS } from "@/lib/server/config";
import { getFleet } from "@/lib/server/fleet-simulation-repository";
import type { OperationalState } from "@/lib/types/robot";

export const dynamic = "force-dynamic"; // Note: This needs to be evaluated on every request

const encoder = new TextEncoder();

export async function GET() {
  let timer: ReturnType<typeof setInterval> | undefined;
  // Note: Per connection, so every client gets each transition no matter who advanced the fleet
  const lastStateByRobotId = new Map<string, OperationalState>();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const sendNewErrors = () => {
        for (const { robot, telemetry } of getFleet()) {
          const previousState = lastStateByRobotId.get(robot.id);
          lastStateByRobotId.set(robot.id, telemetry.operationalState);
          // Note: The first pass only records states. Existing errors already come with the fleet request
          if (previousState === undefined) continue;
          if (
            telemetry.operationalState === "error" &&
            previousState !== "error"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`),
            );
          }
        }
      };
      // Note: An SSE comment flushes the headers, otherwise the connection only opens with the first error
      controller.enqueue(encoder.encode(": connected\n\n"));
      sendNewErrors();
      timer = setInterval(sendNewErrors, STREAM_CHECK_INTERVAL_MS);
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
