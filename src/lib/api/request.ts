type NextFetchInit = RequestInit & { next?: { revalidate: number } };

export class ExternalApiError extends Error {
  constructor(public readonly source: string, message: string, public readonly status?: number, public readonly body?: string) {
    super(message);
    this.name = "ExternalApiError";
  }
}

const loggedKeys = new Set<string>();
const bodyLimit = 280;

function isDevelopment(): boolean { return process.env.NODE_ENV === "development"; }
function truncate(value: string): string { return value.length > bodyLimit ? `${value.slice(0, bodyLimit)}…` : value; }
function sanitizeBody(value: string): string {
  return value
    .replace(/((?:api_?key)=)[^&"\s]+/gi, "$1***")
    .replace(/("(?:api_?key|apiKey)"\s*:\s*")[^"]+/gi, "$1***");
}
function safeUrl(url: URL): string {
  const copy = new URL(url);
  for (const key of [...copy.searchParams.keys()]) {
    if (key.toLowerCase().includes("key")) copy.searchParams.set(key, "***");
  }
  return copy.toString();
}

export function requireApiKey(name: "NASA_API_KEY" | "N2YO_API_KEY"): string {
  const value = process.env[name];
  if (!value) throw new ExternalApiError(name.replace("_API_KEY", ""), `${name} is undefined`);
  if (isDevelopment() && !loggedKeys.has(name)) {
    loggedKeys.add(name);
    console.info(`[aster:env] ${name}=****${value.slice(-4)}`);
  }
  return value;
}

export async function fetchJson<T>(source: string, url: URL, timeoutMs: number, init: NextFetchInit = {}): Promise<T> {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const requestUrl = safeUrl(url);
  try {
    if (isDevelopment()) console.info(`[aster:${source}] GET ${requestUrl}`);
    const response = await fetch(url, { ...init, signal: controller.signal, headers: { Accept: "application/json", "User-Agent": "Aster-Mission-Control/1.0", ...init.headers } });
    const body = await response.text();
    const durationMs = Math.round(performance.now() - startedAt);
    const safeBody = truncate(sanitizeBody(body));
    if (isDevelopment()) console.info(`[aster:${source}] ${response.status} ${durationMs}ms ${safeBody}`);
    if (!response.ok) throw new ExternalApiError(source, `${source} API returned ${response.status}: ${safeBody}`, response.status, safeBody);
    try { return JSON.parse(body) as T; } catch { throw new ExternalApiError(source, `${source} returned invalid JSON`, response.status, safeBody); }
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    const durationMs = Math.round(performance.now() - startedAt);
    const message = controller.signal.aborted ? `${source} fetch timed out after ${timeoutMs}ms` : `${source} endpoint unreachable: ${error instanceof Error ? error.message : "unknown network error"}`;
    if (isDevelopment()) console.error(`[aster:${source}] ${message} (${durationMs}ms)`);
    throw new ExternalApiError(source, message);
  } finally { clearTimeout(timeout); }
}
