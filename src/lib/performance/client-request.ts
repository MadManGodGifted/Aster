export async function fetchClientJson<T>(url: string, label: string): Promise<T> {
  const startedAt = performance.now();
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${label} unavailable (${response.status})`);
    return await response.json() as T;
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.info(`[aster:performance] ${label} ${Math.round(performance.now() - startedAt)}ms`);
    }
  }
}
