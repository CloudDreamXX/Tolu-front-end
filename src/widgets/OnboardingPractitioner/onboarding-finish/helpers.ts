import type { CoachOnboardingState } from "entities/store/coachOnboardingSlice";

const LABEL: Record<keyof CoachOnboardingState, string> = {
  first_name: "First name",
  last_name: "Last name",
  age: "Age",
  gender: "Gender",
  display_credentials: "Display credentials",
  location: "Location",
  timezone: "Time zone",
  expertise_areas: "Expertise areas",
  years_experience: "Years of experience",
  certifications: "Certifications",
  personal_story: "Personal story",
  content_specialties: "Content specialties",
  practitioner_types: "Practitioner types",
  primary_niches: "Primary niches",
  school: "School",
  recent_client_count: "Recent clients",
  target_client_count: "Target clients",
  uses_labs_supplements: "Use of labs/supplements",
  business_challenges: "Business challenges",
  uses_ai: "Use of AI",
  practice_management_software: "Practice software",
  supplement_dispensing_method: "Supplement dispensing method",
  biometrics_monitoring_method: "Biometrics monitoring",
  lab_ordering_method: "Lab ordering",
  supplement_ordering_method: "Supplement ordering",
  profile_picture: "Profile picture",
  coach_admin_privacy_accepted: "Coach admin privacy",
  independent_contractor_accepted: "Independent contractor",
  content_licensing_accepted: "Content licensing",
  affiliate_terms_accepted: "Affiliate terms",
  confidentiality_accepted: "Confidentiality",
  terms_of_use_accepted: "Terms of use",
  media_release_accepted: "Media release",
  two_factor_enabled: "Two-factor enabled",
  two_factor_method: "Two-factor method",
  security_questions: "Security questions",
  security_answers: "Security answers",
  license_certificate_file: "License/certificate file",
  license_certificate_files: "License/certificate files",
  alternate_name: "Alternate name",
  name: "Full name",
  phone: "Phone",
  email: "Email",
  bio: "Bio",
  languages: "Languages",
  dob: "Birth date",
};

const REQUIRED_BY_ROUTE: Record<string, (keyof CoachOnboardingState)[]> = {
  "/select-type": ["practitioner_types"],
  "/onboarding-welcome": ["primary_niches"],
  "/about-your-practice": [
    "school",
    "recent_client_count",
    "target_client_count",
    "uses_labs_supplements",
  ],
  "/profile-setup": [
    "name",
    "alternate_name",
    "bio",
    // "gender",
    "timezone",
    "age",
  ],
};

const isBlank = (v: unknown) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) &&
    v.filter((x) => x != null && String(x).trim() !== "").length === 0);

export function findFirstIncompleteStep(state: CoachOnboardingState) {
  for (const [route, fields] of Object.entries(REQUIRED_BY_ROUTE)) {
    const missing: string[] = [];

    for (const key of fields) {
      const val = state[key];
      if (typeof val === "boolean") {
        if (key.endsWith("_accepted") && val !== true) missing.push(LABEL[key]);
      } else if (isBlank(val)) {
        missing.push(LABEL[key]);
      }
    }

    // if (route === "/about-your-practice") {
    //   const oneFile = !isBlank(state.license_certificate_file);
    //   const manyFiles = !isBlank(state.license_certificate_files);
    //   if (!oneFile && !manyFiles) {
    //     missing.push("License/certificate file(s)");
    //   }
    // }

    if (missing.length > 0) return { route, missing };
  }
  return null;
}
