import { FormState } from "entities/store/clientOnboardingSlice";
import { OnboardClient } from "entities/user";

export const mapOnboardClientToFormState = (
  response: OnboardClient
): FormState => {
  const { basic_info, background, goals_values } = response.profile;

  return {
    date_of_birth: basic_info.date_of_birth ?? "",
    gender: basic_info.gender ?? "",
    age: basic_info.age ?? 0,
    ai_experience: basic_info.ai_experience ?? "",
    country: basic_info.country ?? "",
    language: basic_info.language ?? [],

    occupation: background.occupation ?? "",

    values: goals_values.important_values ?? [],
    support: goals_values.support_network ?? [],

    menopauseStatus: "",
    ZIP: "",
    race: "",
    household: "",
    education: "",
    whatBringsYouHere: "",
    barriers: "",
    personalityType: "",
    readiness: "",
  };
};
