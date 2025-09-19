import { UserOnboardingInfo } from "entities/user";

export const mapUserToCoachOnboarding = (coach: UserOnboardingInfo) => {
  const { onboarding, profile } = coach;
  const { practitioner_info, business_setup, client_tools, agreements } =
    onboarding;

  return {
    first_name: profile.basic_info.first_name || "",
    last_name: profile.basic_info.last_name || "",
    age: profile.basic_info.dob
      ? new Date().getFullYear() -
        new Date(profile.basic_info.dob).getFullYear()
      : undefined,
    gender: profile.basic_info.gender || "",
    display_credentials: undefined,
    location: profile.basic_info.location || "",
    timezone: profile.basic_info.timezone || "",
    expertise_areas: profile.expertise || [],
    years_experience: profile.credentials.years_experience || undefined,
    certifications: practitioner_info.license_files || [],
    personal_story: profile.story || "",
    content_specialties: profile.content_topics || [],
    practitioner_types: practitioner_info.types || [],
    primary_niches: practitioner_info.niches || [],
    school: practitioner_info.school || "",
    recent_client_count: practitioner_info.recent_clients || "",
    target_client_count: practitioner_info.target_clients || "",
    uses_labs_supplements: practitioner_info.uses_labs_supplements
      ? "Yes"
      : "No",
    business_challenges: business_setup.challenges || [],
    uses_ai: business_setup.uses_ai || "",
    practice_management_software: business_setup.practice_software || "",
    supplement_dispensing_method: business_setup.supplement_method || "",
    biometrics_monitoring_method: client_tools.biometrics ? "Yes" : "No",
    lab_ordering_method: client_tools.lab_ordering ? "Yes" : "No",
    supplement_ordering_method: client_tools.supplement_ordering ? "Yes" : "No",
    profile_picture: undefined,
    coach_admin_privacy_accepted: agreements.coach_admin_privacy,
    independent_contractor_accepted: agreements.independent_contractor,
    content_licensing_accepted: agreements.content_licensing,
    affiliate_terms_accepted: agreements.affiliate_terms,
    confidentiality_accepted: agreements.confidentiality,
    terms_of_use_accepted: agreements.terms_of_use,
    media_release_accepted: agreements.media_release,
    two_factor_enabled: undefined,
    two_factor_method: undefined,
    security_questions: undefined,
    security_answers: undefined,
    license_certificate_file: undefined,
    license_certificate_files: practitioner_info.license_files || [],
    alternate_name: profile.basic_info.alternate_name || "",
    name: `${profile.basic_info.first_name} ${profile.basic_info.last_name}`,
    phone: profile.basic_info.phone || "",
    email: profile.basic_info.email || "",
    bio: profile.basic_info.bio || "",
    languages: profile.basic_info.languages || [],
  };
};
