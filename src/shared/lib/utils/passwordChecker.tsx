export function checkPasswordStrength(password: string) {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const feedback: string[] = [];
  const classesCount =
    Number(hasLowercase) +
    Number(hasUppercase) +
    Number(hasNumber) +
    Number(hasSpecialChar);

  if (password.length < minLength)
    feedback.push(`At least ${minLength} characters.`);
  if (!hasLowercase) feedback.push("Add a lowercase letter.");
  if (!hasUppercase) feedback.push("Add an uppercase letter.");
  if (!hasNumber) feedback.push("Add a number.");
  if (!hasSpecialChar) feedback.push("Add a special character.");

  const lengthThresholds = [
    { minLength: 16, score: 3 },
    { minLength: 12, score: 2 },
    { minLength: 8, score: 1 },
  ];

  const lengthScore =
    lengthThresholds.find(({ minLength }) => password.length >= minLength)
      ?.score ?? 0;

  const rawScore = classesCount + lengthScore; // 0–7

  let level = 0; // 0 weak, 1 fair, 2 good, 3 strong
  if (rawScore <= 4) level = 1;
  else if (rawScore <= 5) level = 2;
  else if (rawScore > 5) level = 3;

  const labels = ["Weak", "Fair", "Good", "Strong"] as const;

  return {
    isValid: password.length >= minLength && classesCount >= 3, // policy: ≥8 chars & at least 3 of 4 classes
    rawScore,
    level, // 0..3
    label: labels[level], // "Weak" | "Fair" | "Good" | "Strong"
    feedback,
  };
}

export function StrengthMeter({
  level,
  label,
}: {
  level: 0 | 1 | 2 | 3;
  label: string;
}) {
  const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"]; // red, amber, blue, green
  return (
    <div className="mt-2" aria-live="polite">
      <div
        className="flex gap-1"
        role="img"
        aria-label={`Password strength: ${label}`}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]"
            style={i <= level ? { backgroundColor: colors[level] } : undefined}
          />
        ))}
      </div>
      <div className="mt-1 text-xs text-[#6B7280]">{label}</div>
    </div>
  );
}
