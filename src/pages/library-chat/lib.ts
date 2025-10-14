export const pickPreferredMaleEnglishVoice = (voices: SpeechSynthesisVoice[]) => {
  if (!voices?.length) return null;

  const exactPriority = [
    // macOS
    "Daniel",
    "Alex",
    // iOS
    "Rishi",
    // Google voices
    "Google UK English Male",
    "Google US English Male",
    // Android Chrome / Edge
    "Microsoft Guy Online (Natural)",
  ];

  // Known female voices to explicitly skip
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

  const isMaleVoice = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    const l = v.lang?.toLowerCase() ?? "";
    return (
      /(daniel|alex|fred|rishi|male|guy|matthew|brian)/i.test(v.name) &&
      !femaleBlacklist.some((f) => n.includes(f.toLowerCase()))
    ) && l.startsWith("en");
  };

  const byExact = voices.find((v) => exactPriority.includes(v.name));
  if (byExact) return byExact;

  const englishVoices = voices.filter(
    (v) =>
      v.lang?.toLowerCase().startsWith("en") &&
      !femaleBlacklist.includes(v.name)
  );

  const maleish = englishVoices.find(isMaleVoice);
  if (maleish) return maleish;

  if (englishVoices.length > 0) return englishVoices[0];

  return voices[0] ?? null;
};
