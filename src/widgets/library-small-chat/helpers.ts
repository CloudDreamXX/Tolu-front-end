import { FormValues } from "pages/content-manager/create/case-search";

export const extractVoiceText = (input: string): string => {
  if (!input) return "";

  let s = input;

  s = s.replace(/^```[^\n\r]*\r?\n?/gm, "").replace(/```/g, "");

  s = s
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  s = s.replace(/<\/?[^>]+>/g, "");

  s = s.replace(/^[^{\n]+{[^}]*}\s*/gm, "");

  s = s.replace(/^\s{0,3}#{1,6}\s*/gm, "");
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  s = s.replace(/(\*\*|__)(.*?)\1/g, "$2");
  s = s.replace(/([*_])(.*?)\1/g, "$2");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/[#*]/g, "");

  return s
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\r?\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const generateCaseStory = (watchedCaseValues: Partial<FormValues>) => {
  const {
    age,
    employmentStatus,
    menopausePhase,
    symptoms,
    diagnosedConditions,
    medication,
    lifestyleFactors,
    previousInterventions,
    interventionOutcome,
    suspectedRootCauses,
    protocol,
    goal,
  } = watchedCaseValues;

  return `
    This case involves a ${age}-year-old ${employmentStatus} woman in the ${menopausePhase} phase, presenting with ${symptoms}.
    Her health history includes ${diagnosedConditions}, and she is currently taking ${medication}.
    Lifestyle factors such as ${lifestyleFactors} may be contributing.
    Previous interventions have included ${previousInterventions}, with ${interventionOutcome}.
    The suspected root causes include ${suspectedRootCauses}.
    This case is being used to create a ${protocol} aimed at ${goal}.
  `;
};
