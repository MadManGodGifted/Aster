interface N2yoHealthResponse { info?: { category?: string }; }

export async function verifyN2yoConnection(): Promise<void> {
  const apiKey = process.env.N2YO_API_KEY;
  if (!apiKey) throw new Error("N2YO_API_KEY is not configured");
  const response = await fetch(`https://api.n2yo.com/rest/v1/satellite/above/0/0/0/10/18/&apiKey=${apiKey}`, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error(`N2YO request failed (${response.status})`);
  await response.json() as N2yoHealthResponse;
}
