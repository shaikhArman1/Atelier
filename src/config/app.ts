import type { AppMode } from "@/types";

export function getAppMode(): AppMode {
  const mode = process.env.NEXT_PUBLIC_APP_MODE;
  return {
    isDemo: mode !== "live",
    hasGemini: !!process.env.GEMINI_API_KEY,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasSearch: !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID),
    hasFirebase: !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-key"
    ),
  };
}

export const APP_CONFIG = {
  name: "Atelier",
  tagline: "Interior Design Studio",
  maxUploadSizeMB: 20,
  maxLibraryImagesMB: 50,
  supportedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  supportedFloorPlanTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  defaultConceptPromptVersion: "v1.0",
  maxReferencesPerSession: 20,
  externalSearchFallbackThreshold: 3,
};
