export const SWITCH_KEYS = {
  // PERSONALIZE: "Personalize search",
  CONTENT: "Smart Content",
  LEARN: "Learn",
  RESEARCH: "Research",
  CASE: "Case Search",
  CREATE: "Create content",
  DEF: "Smart Search",
  CARD: "Learning card",
  ASSISTANT: "Coach Assistant",
} as const;

export type SwitchKey = keyof typeof SWITCH_KEYS;
export type SwitchValue = (typeof SWITCH_KEYS)[SwitchKey];

export const SWITCH_CONFIG: Record<
  "default" | "coach" | "personalize",
  {
    options: SwitchValue[];
    defaultOption: string;
  }
> = {
  default: {
    options: [SWITCH_KEYS.DEF, SWITCH_KEYS.LEARN],
    defaultOption: SWITCH_KEYS.DEF,
  },
  coach: {
    //add SWITCH_KEYS.CASE when we will be needed
    options: [
      SWITCH_KEYS.RESEARCH,
      SWITCH_KEYS.CREATE,
      SWITCH_KEYS.CARD,
      SWITCH_KEYS.ASSISTANT,
    ],
    defaultOption: SWITCH_KEYS.RESEARCH,
  },
  personalize: {
    options: [SWITCH_KEYS.DEF, SWITCH_KEYS.CONTENT, SWITCH_KEYS.LEARN],
    defaultOption: SWITCH_KEYS.DEF,
  },
};
