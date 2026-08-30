export async function fetchN2yoSatellite(noradId: number): Promise<never> {
  const apiKey = process.env.N2YO_API_KEY;
  if (!apiKey) throw new Error("N2YO_API_KEY is not configured");
  throw new Error(`N2YO satellite lookup for ${noradId} requires an observer location`);
}
