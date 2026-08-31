# VOID performance audit

Audit date: 2026-08-30. Scope: React rendering, network polling, animation/compositing, retained client state, and server request duration. Development builds now log browser long tasks of 50 ms or more and client request durations using the `[void:performance]` prefix. Server-side upstream timings remain logged by `src/lib/api/request.ts` in development.

## Ranked findings

| Rank | Impact | Finding | Evidence | Resolution |
| --- | --- | --- | --- | --- |
| 1 | Critical | CelesTrak failures held the entire mission response for two 12-second timeouts plus the 5-second retry delay. | `getMissionSnapshot` awaited the catalog promise directly. | The critical path now returns after 4.5 seconds; the required retry completes in the background, uses one in-flight request, and observes a 5-minute failure cooldown. |
| 2 | High | Every telemetry animation frame updated React state. | `AnimatedNumber` called `setState` from Framer Motion `onUpdate`. | The displayed text is now updated through a ref; React only renders for a real telemetry value change. |
| 3 | High | The scanline overlay forced blend compositing across the viewport, while grain used an oversized rotated fixed layer. | `mix-blend-mode: overlay`, `inset: -50%`, and transform in global effects. | Effects are paint-contained, use regular alpha compositing, and use viewport-sized tiled grain. |
| 4 | Medium-high | Eight independent satellite animation timelines ran continuously. | One infinite Framer Motion `motion.g` per marker. | Markers now share one transform animation; radar and ISS retain their own purposeful motion. |
| 5 | Medium | Hidden tabs continued polling mission data and ISS position. | `refetchIntervalInBackground: true`. | Background polling is disabled; foreground data cadence is unchanged and refocus refetch remains enabled. |
| 6 | Medium | Mission-feed event keys were retained indefinitely. | `seen` was a growing `Set`. | The set is bounded to the same 25-event retention limit as rendered feed data. |
| 7 | Medium | Multiple dashboard modules subscribe to the full mission query object. | `useTelemetry` and `useOrbitalData` each wrap `useMissionSnapshot`. | React Query deduplicates the network request; selector-level subscriptions are a future refinement once dashboard module boundaries are consolidated. |
| 8 | Low-medium | Date and compact-number formatters were constructed during render. | `new Intl.DateTimeFormat` and `new Intl.NumberFormat` inside helper functions. | Formatters are now module singletons. |
| 9 | Low-medium | CelesTrak data was re-requested despite already usable in-memory telemetry. | The catalog fetch ran on every mission poll. | Cached telemetry responds immediately while one deduplicated refresh runs in the background. |
| 10 | Low | The global stylesheet retained an unused scan keyframe. | `@keyframes scan` has no matching animation. | Leave for a later stylesheet cleanup; it has no runtime frame cost. |

## Instrumentation and validation

- Browser long tasks at or above 50 ms are logged only in development; unsupported browsers simply skip this observer.
- Browser request timing covers `/api/mission` and `/api/iss` and does not expose credentials.
- Existing server diagnostics continue to record masked upstream request URLs, response status, execution time, timeout, parse failure, and readable error details.
- The optimizations preserve the existing visual design, layout, polling cadence while visible, service-health behavior, and CelesTrak retry requirement.
