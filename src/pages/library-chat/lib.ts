export const pickPreferredMaleEnglishVoice = (
  voices: SpeechSynthesisVoice[]
) => {
  if (!voices?.length) return null;

  const exactPriority = [
    "Daniel",
    // macOS classic US male
    "Alex",
    // iOS Indian English male (often available)
    "Rishi",
    // Less common but male
    "Fred",
    // Android/Chrome
    "Google UK English Male",
  ];

  const byExact = voices.find((v) => exactPriority.includes(v.name));
  if (byExact) return byExact;

  const enGb = voices.filter((v) => v.lang?.toLowerCase().startsWith("en-gb"));
  const enGbMaleish = enGb.find((v) => /daniel|male/i.test(v.name));
  if (enGbMaleish) return enGbMaleish;

  const enUs = voices.filter((v) => v.lang?.toLowerCase().startsWith("en-us"));
  const enUsMaleish = enUs.find((v) => /(alex|fred|male)/i.test(v.name));
  if (enUsMaleish) return enUsMaleish;

  const anyEn = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const anyEnMaleish = anyEn.find((v) =>
    /(daniel|alex|fred|rishi|male)/i.test(v.name)
  );
  if (anyEnMaleish) return anyEnMaleish;

  return anyEn[0] ?? voices[0] ?? null;
};
