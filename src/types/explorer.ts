export interface ExplorerApproach {
  date: string;
  missDistanceKm: number | null;
  relativeVelocityKph: number | null;
  orbitingBody: string | null;
}

export interface ExplorerObjectSummary {
  id: string;
  designation: string;
  estimatedDiameterMinKm: number | null;
  estimatedDiameterMaxKm: number | null;
  hazardous: boolean;
  absoluteMagnitude: number | null;
  orbitalPeriodDays: number | null;
  firstObservationDate: string | null;
  lastObservationDate: string | null;
  closeApproachCount: number;
}

export interface ExplorerObjectDetails extends ExplorerObjectSummary {
  orbitalClass: string | null;
  discoveryDate: string | null;
  approaches: ExplorerApproach[];
}
