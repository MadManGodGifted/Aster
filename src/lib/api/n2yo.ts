import { ExternalApiError, fetchJson, requireApiKey } from "@/lib/api/request";

interface N2yoHealthResponse { info?: { category?: string }; }

export async function verifyN2yoConnection(): Promise<void> {
  const apiKey = requireApiKey("N2YO_API_KEY");
  const payload = await fetchJson<N2yoHealthResponse>("N2YO", new URL(`https://api.n2yo.com/rest/v1/satellite/above/0/0/0/10/18/&apiKey=${apiKey}`), 12000, { next: { revalidate: 600 } });
  if (!payload.info) throw new ExternalApiError("N2YO", "N2YO returned an invalid health payload");
}
