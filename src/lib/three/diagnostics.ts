export const sceneDiagnostics = {
  loadPerformancePanel: process.env.NODE_ENV === "development",
  logTextureDecisions: process.env.NODE_ENV === "development",
} as const;
