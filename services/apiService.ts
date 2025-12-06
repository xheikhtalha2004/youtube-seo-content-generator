import { AnalysisResult } from "../types";

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchAnalysisData = async (
  keyword: string,
  model: string
): Promise<AnalysisResult> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analyze?keyword=${encodeURIComponent(keyword)}&model=${encodeURIComponent(model)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Failed to fetch analysis data from the backend."
      );
    }

    const data: AnalysisResult = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error(
        "Could not connect to the backend server. Is it running at http://localhost:8000?"
      );
    }
    throw error;
  }
};
