export type IOSUtterance = SpeechSynthesisUtterance & { voiceURI?: string };

export const pickPreferredMaleEnglishVoice = (
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null => {
  if (!voices?.length) return null;

  const malePriority = [
    "Daniel",
    "Alex",
    "Rishi",
    "Google UK English Male",
    "Google US English Male",
    "Microsoft Guy Online (Natural)",
  ];

  const femaleBlacklist = [
    "Samantha",
    "Karen",
    "Moira",
    "Martha",
    "Victoria",
    "Serena",
    "Tessa",
    "Allison",
    "Google UK English Female",
    "Google US English Female",
  ];

  const isMaleish = (v: SpeechSynthesisVoice) =>
    /(daniel|alex|rishi|fred|male|guy|matthew|brian|uk)/i.test(v.name) &&
    !femaleBlacklist.includes(v.name);

  let match =
    voices.find((v) => malePriority.includes(v.name)) ||
    voices.find((v) => isMaleish(v) && v.lang.startsWith("en")) ||
    voices.find((v) => v.lang.startsWith("en-gb")) ||
    voices.find((v) => v.lang.startsWith("en-us"));

  if (!match && voices.some((v) => /male/i.test(v.voiceURI))) {
    match = voices.find((v) => /male/i.test(v.voiceURI));
  }

  return match ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
};
