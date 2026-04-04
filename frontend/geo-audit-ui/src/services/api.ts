import type { AuditResponse } from "../types/audit";

const API_BASE = "http://127.0.0.1:8000";

export const auditWebsite = async (url: string): Promise<AuditResponse> => {
  const response = await fetch(`${API_BASE}/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};