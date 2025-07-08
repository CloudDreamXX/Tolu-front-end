export const SWITCH_KEYS = {
  PERSONALIZE: "Personalize search",
  CONTENT: "Content mod",
  RESEARCH: "Research",
  CASE: "Case Search",
  CREATE: "Create content",
  DEF: "Search",
} as const;

export type SwitchKey = keyof typeof SWITCH_KEYS;
export type SwitchValue = (typeof SWITCH_KEYS)[SwitchKey];

export const SWITCH_CONFIG: Record<
  "default" | "coach",
  {
    options: SwitchValue[];
    defaultOption: string;
  }
> = {
  default: {
    options: [SWITCH_KEYS.DEF, SWITCH_KEYS.PERSONALIZE, SWITCH_KEYS.CONTENT],
    defaultOption: SWITCH_KEYS.DEF,
  },
  coach: {
    options: [SWITCH_KEYS.RESEARCH, SWITCH_KEYS.CASE, SWITCH_KEYS.CREATE],
    defaultOption: SWITCH_KEYS.RESEARCH,
  },
};
