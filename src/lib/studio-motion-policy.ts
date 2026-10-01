export interface StudioMotionPreferences {
  ready: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType?: string;
}

export interface StudioPlaybackConditions extends StudioMotionPreferences {
  inView: boolean;
  documentVisible: boolean;
  userPaused: boolean;
  failed: boolean;
}

/** Unknown browser network hints are not treated as a slow connection. */
export function shouldLoadStudioMedia(preferences: StudioMotionPreferences): boolean {
  return preferences.ready
    && !preferences.isMobile
    && !preferences.reducedMotion
    && !preferences.saveData
    && !["slow-2g", "2g", "3g"].includes(preferences.effectiveType ?? "");
}

/** User pause and failures survive automatic visibility changes. */
export function shouldPlayStudioMedia(conditions: StudioPlaybackConditions): boolean {
  return shouldLoadStudioMedia(conditions)
    && conditions.inView
    && conditions.documentVisible
    && !conditions.userPaused
    && !conditions.failed;
}

/** A rejected request caused by a concurrent pause is not an autoplay failure. */
export function isStudioPlaybackFailure(error: unknown): boolean {
  return !(typeof error === "object" && error !== null && "name" in error && error.name === "AbortError");
}
