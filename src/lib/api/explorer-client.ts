import { fetchClientJson } from "@/lib/performance/client-request";
import type { ExplorerObjectDetails, ExplorerObjectSummary } from "@/types/explorer";

export async function fetchExplorerSearch(query: string): Promise<ExplorerObjectSummary[]> {
  const response = await fetchClientJson<{ results: ExplorerObjectSummary[] }>(`/api/explorer/search?q=${encodeURIComponent(query)}`, "explorer search");
  return response.results;
}

export async function fetchExplorerObject(id: string): Promise<ExplorerObjectDetails> {
  const response = await fetchClientJson<{ object: ExplorerObjectDetails }>(`/api/explorer/object/${encodeURIComponent(id)}`, "object detail");
  return response.object;
}
