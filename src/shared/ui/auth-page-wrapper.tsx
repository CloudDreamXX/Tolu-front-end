import { setFromUserInfo } from "entities/store/clientOnboardingSlice";
import { setCoachOnboardingData } from "entities/store/coachOnboardingSlice";
import { mapOnboardClientToFormState } from "entities/store/helpers";
import { UserOnboardingInfo, UserService } from "entities/user";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { findFirstIncompleteClientStep } from "widgets/OnboardingClient/DemographicStep/helpers";
import { findFirstIncompleteStep } from "widgets/OnboardingPractitioner/onboarding-finish/helpers";

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

export const AuthPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const userPersisted = localStorage.getItem("persist:user");
  let isCoach = false;

  useEffect(() => {
    if (userPersisted) {
      try {
        const parsed = JSON.parse(userPersisted);
        const user = parsed?.user ? JSON.parse(parsed.user) : null;
        const roleID = user?.roleID;
        isCoach = roleID === 2;
      } catch (error) {
        console.error("Failed to parse persisted user:", error);
      }
    }
    setIsUserLoaded(true);
  }, [userPersisted]);

  useEffect(() => {
    const loadUser = async () => {
      if (!isUserLoaded) return;
      const onboardingComplete = UserService.getOnboardingStatus();

      if ((await onboardingComplete).onboarding_filled) {
        isCoach ? nav("/content-manager/create") : nav("/library");
      } else {
        if (isCoach) {
          const coach = await UserService.getOnboardingUser();
          const coachData = mapUserToCoachOnboarding(coach);
          dispatch(setCoachOnboardingData(coachData));

          const issue = findFirstIncompleteStep(coachData);
          if (issue) {
            nav(issue.route);
            return;
          }
        } else {
          const userInfo = await UserService.getOnboardClient();
          const clientData = mapOnboardClientToFormState(userInfo);
          dispatch(setFromUserInfo(userInfo));

          const issue = findFirstIncompleteClientStep(clientData);
          if (issue) {
            nav(issue.route);
            return;
          }
        }
      }
    };
    loadUser();
  }, [isUserLoaded, dispatch, isCoach, nav]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[100dvh] relative overflow-y-auto overflow-x-hidden"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      {children}
      <div className="absolute bottom-0 w-full flex items-center justify-center gap-[24px] bg-white text-[16px] text-[#5F5F65] p-[16px]">
        <img src={"/hipaa.png"} className="h-[50px]" />
        <img src={"/ssl.png"} className="h-[50px]" />
        All information you share is secure and confidential
      </div>
    </div>
  );
};
