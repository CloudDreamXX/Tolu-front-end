import { UserOnboardingInfo } from "entities/user";

type OnboardingInfo = NonNullable<UserOnboardingInfo["onboarding"]>;

const emptyOnboarding: OnboardingInfo = {
  practitioner_info: {
    types: [],
    niches: [],
    school: null,
    license_files: [],
    recent_clients: null,
    target_clients: null,
    uses_labs_supplements: null,
    target_targets: "",
  },
  business_setup: {
    challenges: [],
    uses_ai: null,
    practice_software: null,
    supplement_method: null,
  },
  client_tools: {
    biometrics: null,
    lab_ordering: null,
    supplement_ordering: null,
  },
  agreements: {
    coach_admin_privacy: false,
    independent_contractor: false,
    content_licensing: false,
    affiliate_terms: false,
    confidentiality: false,
    terms_of_use: false,
    media_release: false,
  },
  id: "",
};

export const mapUserToCoachOnboarding = (coach: UserOnboardingInfo) => {
  const onboardingSafe = coach.onboarding ?? emptyOnboarding;
  const { profile } = coach;

  const { practitioner_info, business_setup, client_tools, agreements } =
    onboardingSafe;

  return {
    first_name: profile.basic_info.first_name || "",
    last_name: profile.basic_info.last_name || "",
    age: profile.basic_info.dob
      ? new Date().getFullYear() -
        new Date(profile.basic_info.dob).getFullYear()
      : undefined,
    gender: profile.basic_info.gender || "",
    expertise_areas: profile.expertise || [],
    // years_experience: profile.credentials.years_experience || undefined,

    certifications: practitioner_info.license_files || [],
    practitioner_types: practitioner_info.types || [],
    primary_niches: practitioner_info.niches || [],
    school: practitioner_info.school || "",
    recent_client_count: practitioner_info.recent_clients || "",
    target_client_count: practitioner_info.target_clients || "",
    uses_labs_supplements:
      practitioner_info.uses_labs_supplements !== null ? "Yes" : "No",

    business_challenges: business_setup.challenges || [],
    uses_ai: business_setup.uses_ai || "",
    practice_management_software: business_setup.practice_software || "",
    supplement_dispensing_method: business_setup.supplement_method || "",

    biometrics_monitoring_method: client_tools.biometrics ? "Yes" : "No",
    lab_ordering_method: client_tools.lab_ordering ? "Yes" : "No",
    supplement_ordering_method: client_tools.supplement_ordering ? "Yes" : "No",

    coach_admin_privacy_accepted: agreements.coach_admin_privacy ?? false,
    independent_contractor_accepted: agreements.independent_contractor ?? false,
    content_licensing_accepted: agreements.content_licensing ?? false,
    affiliate_terms_accepted: agreements.affiliate_terms ?? false,
    confidentiality_accepted: agreements.confidentiality ?? false,
    terms_of_use_accepted: agreements.terms_of_use ?? false,
    media_release_accepted: agreements.media_release ?? false,

    alternate_name: profile.basic_info.alternate_name || "",
    name: `${profile.basic_info.first_name} ${profile.basic_info.last_name}`,
    phone: profile.basic_info.phone || "",
    email: profile.basic_info.email || "",
    bio: profile.basic_info.bio || "",
    languages: profile.basic_info.languages || [],
    timezone: profile.basic_info.timezone || "",
  };
};
