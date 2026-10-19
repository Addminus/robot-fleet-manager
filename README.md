# Fleet Dashboard

A monitoring dashboard for a fleet of service robots from two vendors: a triage view of the whole fleet, and a live view of a single robot.

## Running it

Requires Node 20 or newer.

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm test                # unit tests
pnpm lint                # Biome
pnpm exec tsc --noEmit   # type check
```

## Try it

1. **Open a robot.** Battery and state update every 1–2 s over a live stream.
2. **Use the developer controls** on the detail page:
   - **Cause error:** a toast appears on every page and links to the robot.
   - **Break reporting:** after 20 s the robot is reported as lost.
   - **Restore reporting:** the robot catches up on the time it was silent.
3. **Stop the dev server.** The detail page shows "Live updates paused" while "Last update" keeps counting up. When you restart it, the browser reconnects on its own.

---

## How I read the challenge

This submission is about the **user interface**.

A fleet view and a robot detail view are an obvious answer to the brief. What I wanted to show is what those views need from a fleet manager's point of view. When every robot works as expected, there's little to look at. **Failures are the most important part of this dashboard.** A fleet manager needs to know when something goes wrong, and a plain list of every robot doesn't tell them that. So surfacing and highlighting error states is the priority, and that's what the dashboard concentrates on.

The brief says robots report roughly once per second, so I set myself the goal of getting fleet state to the user in near real time. Polling at that rate would get expensive in large fleets, so I looked for a better way to push changes to the browser and chose streaming. Given the scope that emerged during planning, I picked **Server-Sent Events**. The communication only goes one way, from server to browser, so they fit better than WebSockets. See [Server-Sent Events rather than WebSockets](#server-sent-events-rather-than-websockets).

I am furthermore basing a lot of my assumptions about the states a service robot can have on my little vacuum cleaner robot at home. This might be a bit limiting as real service robots probably have richer states. 

### The data path

After researching the company and reading the brief, I noticed that telemetry passes through several hops before a fleet manager sees it:
1. **Vendor aggregation:** robots from different manufacturers report through their vendor, every vendor might report at its own pace.
2. **Backend ingestion:** the backend normalizes those reports into one model.
3. **Forwarding to the UI:** the backend sends the data on to the browser.

The "once per second" describes how often the *robot* reports, not what's guaranteed to reach the browser. That difference shapes the UI: data is only ever as fresh as its last report, and the page has to show when that report is getting old.

### Why there's a backend at all

I wanted live data and real streaming behavior, not a fixed array of robots held and displayed on the client. That needs a server. To keep the submission lean, and to spare reviewers starting several processes, I chose **Next.js**: it gives me a backend and a frontend in one project.

I didn't choose it for its rendering modes. For a real dashboard Next.js is probably overkill, and a slim client-only static app would work just as well. Using it has costs I had to keep in mind:
- **The TanStack Query client** lives in a `"use client"` `Providers` component, created once in `useState`. That gives each browser session its own cache, and no two server renders share one.
- **Route handlers** need `export const dynamic = "force-dynamic"`, so Next doesn't prerender or cache them, which would break a stream.
- **Dynamic page params arrive URL-encoded,** so `vendor:01` comes in as `vendor%3A01` and has to be decoded once at the page.
- **The simulation is kept on `globalThis`,** so hot reload doesn't create a new fleet on every save.
- **I put the client boundary high in the tree** (`lib/client/containers`), so the app behaves like a static client app. I'm aware Next still prerenders the shell.

I am also not using an RSC to check for a robots existence before returning the robot detail page. This is handled on the client by classifying errors. 

### The backend and the simulation

I don't consider the backend and the simulation part of the submission. They're in the code and free to look at, and they're where AI helped me most. The backend is a thin wrapper that exposes the simulation's data to the client. It's a **test fixture for the UI**, and a way to experience real streaming behavior. Its tests only cover what the UI directly depends on.

**How the simulation works**
- **Two vendors** (`robotics-international`: 10 robots reporting every 1 s; `cryotec`: 5 robots reporting every 2 s).
- **A fixed duty cycle per robot:** it works for X, idles for Y, and repeats. X and Y are random per robot but never change.
- **Charging and errors interrupt the cycle:**
  - Below 20 % battery a working robot charges to 95 %, then starts a new work block.
  - Each work start has a chance of failing (currently high at 0.8, so failures show up quickly), and an error stays until it's cleared.
  - A robot at 0 % stops reporting.
- **Battery** drains only while working, and much faster than in reality, so a whole cycle is visible within minutes.
- **No background timer.** A robot is caught up whenever it's read, one vendor report at a time. Its `observedAt` only ever lands on its vendor's report schedule, so reading a robot never makes it look fresher than it is. Everything that depends on time scales with elapsed seconds, so both vendors drain at the same real-world rate.
- **The developer controls** (`PATCH /api/robots/:id`) overwrite state, battery or reporting. The change appears with the robot's next report. Broken reporting keeps the robot working offline, and when reporting is restored, the missed reports are replayed.

| Endpoint | Used for |
|---|---|
| `GET /api/robots` | Fleet snapshot, polled every 10 s |
| `GET /api/robots/:id` | One robot: identity and first telemetry |
| `PATCH /api/robots/:id` | Developer controls |
| `GET /api/robots/:id/stream` | Live telemetry for one robot |
| `GET /api/robots/stream` | New errors across the fleet |

---

## The dashboards

### Fleet page: triage
It answers "what needs me right now?". Problems come first; all robots follow, sorted by last seen. **A robot needs attention when the system/software can't resolve the problem on its own:**

| State | Meaning | What the manager does |
|---|---|---|
| Error | Faulted as reported by the robot/vendor itself | Reset it (in real life this may or may not require a technician) |
| Flat | Its last report showed an empty battery, and it has stopped reporting | Manually charge it (no software reset for this) |
| Lost | No report for 20 s, cause unknown | Investigate (no software reset for this) |

Flat is a lost robot whose last report explains the silence. Without that report, a silent robot is simply lost. In the simulator this is expressed with the state "Charging" but having 0% battery.

A draining battery ("battery is almost empty") isn't on the list. I'm assuming that a robot charges on its own, and listing problems that fix themselves teaches people to ignore the list. IMO, that's the one thing a triage list must never do. Error and flat are kept apart because they call for different actions.

A new error anywhere in the fleet shows a **toast** on every page, linking to the robot.

### Robot detail page: inspection
- **Live** state, battery and time since the last report.
- **Current job:** Working ⇄ Idle, with "paused" while charging and greyed out with a "reason" (A meaningful error message is not part of the simulation) when the robot is in error, flat or lost.
- **Developer controls** to force the robot into each of these states on demand. This allows for quickly toggling through the states.

## Tech stack

- **Next.js:** one project for the backend and the frontend; see above.
- **TanStack Query:** for request/response data such as the fleet snapshot, polling and robot identity, where caching and refetching are exactly what it's for. Live telemetry doesn't go through it. That arrives through `EventSource`, which needs no deduplication, invalidation or retries. The one exception: fleet error events are written into the cached fleet, so the attention views update immediately, saving one refetch on every error.
- **Tailwind:** simple styling. I kept the UI deliberately plain: animations are a big time sink, and nothing here needs hand-made accessibility behavior. Focus management and keyboard handling are a solved problem, and that's what Radix, Base UI and the like are for. Nothing I built needs them yet. Toasts that stack or disappear on a timer would be the first thing that does.
- **Biome:** lint and format in one fast tool with almost no configuration.
- **Vitest:** unit tests for the pure helpers.

## Key decisions

### Server-Sent Events rather than WebSockets
The data flows one way: the server has things to tell the browser, and the browser has nothing to say back on the same channel. SSE is built for exactly that:
- **Reconnection** after a dropped connection is built into the browser's `EventSource`.
- **It's a plain HTTP response from a route handler,** with no protocol upgrade and no extra server.
- **Event ids (`Last-Event-ID`) and named events** are part of the protocol, for when missed events need replaying or several kinds of message share one stream. I don't use them yet; see *What I'd do next*.

The few writes, the developer controls, go over an ordinary `PATCH` with status codes and normal error handling. I'd switch to WebSockets if writes became frequent and two-way, for example remote-driving a robot. Designing for that now would be speculation.

### Poll the fleet, stream the details
- **The fleet snapshot is polled every 10 s.** Battery is a slow ramp, so pushing it would mostly send messages that repeat the last one.
- **One fleet-wide stream carries only new errors**, the event that can't wait 10 s.
- **The detail page streams everything about one robot.** There's only one detail page open at a time, however large the fleet gets.

So the choice of transport follows from what each view is for: triage needs a cheap overview plus urgent events, and inspection needs everything about one robot.

### Determining when a robot is lost
Whether a robot is *lost* depends on how much time has passed since its last report, and that time keeps passing after the last message arrives. If the server labelled robots "healthy" and the connection then dropped, the page would show a healthy fleet indefinitely: the connection that would carry the correction is the one that broke.

So the server sends only observations: `observedAt`, battery and state. The browser derives health from those and the current time (`getRobotHealth`): error, flat, or lost after 20 s without a report. On the detail page a one-second clock re-evaluates this, so a robot that stops reporting is flagged by the page itself, with no message needed. A dropped connection is shown separately ("Live updates paused"), so a broken connection is never mistaken for a broken robot.

This could arguably be seen as business logic that belongs on the server. With a second timestamp, `observedAt` (when the robot measured) and `receivedAt` (when the server got it), the server could classify the connection to the vendor and answer the question "is 1 robot down vs is the entire vendor down?" (see What I'd do next). But a client would still need to observe its own connection to the server. For the sake of this submission I lumped all of this into the single `observedAt` variable. 

## Deliberate omissions

- **Authentication.** Nothing here is authenticated, and everything is simulated. The brief describes a fleet manager looking at robots, not users, accounts or tenants. I doubt that a login form with an in-memory user store would have demonstrated anything useful.
- **Robot position and a site map.** A nice later addition, but triage doesn't need coordinates, and the detail view had more useful things to show.
- **A command path.** Olivaw works on upskilling robots with AI, which needs a way to send commands to them. Robots come from different vendors, so a command isn't request/response: it travels from browser to backend to vendor API to robot. A vendor can accept it while the robot never receives it (battery, deprecated signal). Doing that properly means tracking the request lifecycle. The developer controls are a test tool, not that path.
- **Telemetry history and charts.** These are backend business logic, which I didn't want to focus on in this time frame.
- **UI tests that check the DOM.** To save time I didn't write component or browser tests. Instead the client follows a container/presentational split: containers (`lib/client/containers`) derive every value from pure helpers, and the components only render what they're given. The helpers are unit-tested: health, attention, fleet composition and job status. So the logic deciding what the page shows is covered, but its rendering, the streaming hooks and the user flows are not.
- **Observability.** The UI handles failures for the user: an error boundary when the first load fails, a banner when a fleet refresh fails, and one when the live stream drops. But nothing is reported anywhere. Errors only reach the browser console, and there's no logging or monitoring on the server.

## Known limitations

- **One staleness threshold for every vendor (20 s).** It should be per vendor: a 10-second-old reading is normal for a slow vendor but a warning sign for a fast one.
- **Missed error events aren't replayed.** If the fleet stream reconnects, errors that happened in the gap get no toast, though the next poll still shows them.
- **Connection limit in development.** Over HTTP/1.1, which local development uses, browsers allow 6 connections per domain, and each detail tab holds 2 streams. HTTP/2 deployments aren't affected.
- **The fleet lives in one server process's memory,** so several instances would each simulate a different fleet.
- **The API returns the simulation's internal fields** next to the telemetry.

## What I'd do next

### In this project

1. **Handle a refused stream.** When a stream is refused with an error response, `EventSource` stops retrying for good, but the page still says "Reconnecting". It should say that live updates have stopped and offer a retry.
2. **Per-vendor freshness:** send each vendor's reporting interval to the client and judge "lost" against it.
3. **Real server logic.** Grow the backend from a test fixture into a service with its own business logic:
   - **An event log in a small database:** every state change (error, charging, flat, gone quiet) stored with its time. That gives the detail page a real event history.
   - **More fleet events over the stream,** derived on the server from that log: empty batteries, robots going quiet. Then the fleet page's ages could count up between polls, too. Polling already gets 90 % of the way there very cheaply, which is why I stopped there.
   - **Replay of missed events:** with a log in place, event ids plus `Last-Event-ID` let a reconnect pick up where it stopped, so no notification is lost.
4. **A separate API response type,** so the simulation's internals don't leak to the client.

### For production

1. **Real ingestion and storage.** Vendor adapters instead of the simulation, current state in a fast store, and history in a time-series store. Each report would also carry `receivedAt` next to `observedAt`.
2. **Integration-level detection:** if every robot of one vendor goes quiet at once, the pipeline is broken, not the robots. That should be one "vendor integration degraded" banner, not a dozen "lost" rows.
3. **Several server instances.** Shared state plus a pub/sub channel, so every instance serves the same fleet and streams the same events. Today the fleet lives in one process's memory.
4. **A real command path** with a visible lifecycle: sent, acknowledged by the vendor, confirmed by the robot, failed or timed out. The developer controls would be removed or kept behind a flag.
5. **Authentication and authorization,** deliberately left out here as stated earlier.
6. **Observability.** Error tracking in the browser (e.g. Sentry), covering render errors, failed requests and streams that drop or are refused. Structured logging and metrics on the server: open streams, reconnects, and the delay between a robot's report and its arrival. For a monitoring tool, knowing when the dashboard itself is wrong matters as much as knowing when a robot is.
7. **UI tests on the DOM.** Component tests (Testing Library) for the presentational components, and end-to-end tests (Playwright) for the flows that matter most: an error reaching the toast, a robot turning lost, a dropped stream showing the banner. Visual regression tests would keep the status colors and states from drifting.
8. **Automated checks.** Today lint, types and tests are run by hand. Pre-commit hooks (e.g. Lefthook, Husky) would run them, plus a production build, before every commit. Whether this also needs to happen on CI is debatable. 

## Use of AI

The brief allows AI, and I think it's fair to say where I used it:
- **Research:** reading up on the domain and on trade-offs such as SSE versus WebSockets.
- **This README:** structuring and formatting it. The reasoning and decisions are mine.
- **The simulation:** generating parts of the simulation code to save time. As stated above, in my opinion the backend and simulation are a fixture for the UI, not the focus of this submission.
- **Parts of the UI display elements:** help implementing some of the display elements in order to save time. To my design and structure. I'm happy to go through the details in the discussion.

Every change was reviewed by me before it was committed, and I can explain any decision in the code.
