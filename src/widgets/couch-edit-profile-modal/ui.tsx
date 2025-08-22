import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ProfileCoach from "shared/assets/icons/profile-coach";
import { cn } from "shared/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "shared/ui";
import { StepFocus } from "./components/StepFocus";
import { StepGeneral } from "./components/StepGeneral";
import { StepPractice } from "./components/StepPractice";
import { StepSafety } from "./components/StepSafety";
import { StepType } from "./components/StepType";
import { steps } from "./helpers";
import { UserOnboardingInfo, UserService } from "entities/user";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";

const DEFAULT_STATE: CoachOnboardingState = {
  first_name: "",
  last_name: "",
  age: 0,
  gender: "",
  display_credentials: "",
  location: "",
  timezone: "",
  expertise_areas: [],
  years_experience: "",
  certifications: [],
  personal_story: "",
  content_specialties: [],
  practitioner_types: [],
  primary_niches: [],
  school: "",
  recent_client_count: "",
  target_client_count: "",
  uses_labs_supplements: "",
  business_challenges: [],
  uses_ai: "",
  practice_management_software: "",
  supplement_dispensing_method: "",
  biometrics_monitoring_method: "",
  lab_ordering_method: "",
  supplement_ordering_method: "",
  coach_admin_privacy_accepted: false,
  independent_contractor_accepted: false,
  content_licensing_accepted: false,
  affiliate_terms_accepted: false,
  confidentiality_accepted: false,
  terms_of_use_accepted: false,
  media_release_accepted: false,
  two_factor_enabled: false,
  two_factor_method: "",
  security_questions: "",
  security_answers: "",
  profile_picture: "",
  // If your CoachOnboardingState includes this, keep it; otherwise remove
  // alternate_name: "",
};

// Helpers
const computeAge = (dob?: string | null) => {
  if (!dob) return 0;
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const birth = new Date(y, m - 1, d);
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age--;
  return Math.max(0, age);
};

const yn = (b: boolean | null | undefined) =>
  b == null ? "" : b ? "Yes" : "No";

const mapUserToCoachState = (u: UserOnboardingInfo): CoachOnboardingState => {
  const bi = u.profile.basic_info;
  const cred = u.profile.credentials;
  const pr = u.onboarding.practitioner_info;
  const bs = u.onboarding.business_setup;
  const ct = u.onboarding.client_tools;
  const ag = u.onboarding.agreements;

  return {
    ...DEFAULT_STATE,

    first_name: bi.name ?? "",
    alternate_name: bi.alternate_name ?? "",

    age: computeAge(bi.dob),
    gender: (bi as any).gender ?? "",

    display_credentials: bi.credentials ?? "",
    location: bi.location ?? "",
    timezone: bi.timezone ?? "",
    profile_picture: bi.headshot ?? "",

    expertise_areas: u.profile.expertise ?? [],
    years_experience:
      cred.years_experience != null ? String(cred.years_experience) : "",
    certifications: cred.certifications ?? [],
    personal_story: u.profile.story ?? "",
    content_specialties: u.profile.content_topics ?? [],

    practitioner_types: pr.types ?? [],
    primary_niches: pr.niches ?? [],
    school: pr.school ?? "",
    recent_client_count: pr.recent_clients ?? "",
    target_client_count: pr.target_clients ?? "",
    uses_labs_supplements: yn(pr.uses_labs_supplements),

    business_challenges: bs.challenges ?? [],
    uses_ai: yn(bs.uses_ai),
    practice_management_software: bs.practice_software ?? "",
    supplement_dispensing_method: bs.supplement_method ?? "",

    biometrics_monitoring_method: yn(ct.biometrics),
    lab_ordering_method: yn(ct.lab_ordering),
    supplement_ordering_method: yn(ct.supplement_ordering),

    coach_admin_privacy_accepted: ag.coach_admin_privacy,
    independent_contractor_accepted: ag.independent_contractor,
    content_licensing_accepted: ag.content_licensing,
    affiliate_terms_accepted: ag.affiliate_terms,
    confidentiality_accepted: ag.confidentiality,
    terms_of_use_accepted: ag.terms_of_use,
    media_release_accepted: ag.media_release,

    two_factor_enabled: DEFAULT_STATE.two_factor_enabled,
    two_factor_method: DEFAULT_STATE.two_factor_method,
    security_questions: DEFAULT_STATE.security_questions,
    security_answers: DEFAULT_STATE.security_answers,
  };
};

function StepBody({
  id,
  data,
  setDataState,
}: Readonly<{
  id: string;
  data: CoachOnboardingState;
  setDataState: Dispatch<SetStateAction<CoachOnboardingState>>;
}>) {
  switch (id) {
    case "general":
      return <StepGeneral data={data} setDataState={setDataState} />;
    case "safety":
      return <StepSafety data={data} setDataState={setDataState} />;
    case "practice":
      return <StepPractice data={data} setDataState={setDataState} />;
    case "type":
      return <StepType data={data} setDataState={setDataState} />;
    case "focus":
      return <StepFocus data={data} setDataState={setDataState} />;
    default:
      return null;
  }
}

type CouchEditProfileModalProps = {
  user: UserOnboardingInfo | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const CouchEditProfileModal = ({
  user,
  open,
  setOpen,
}: CouchEditProfileModalProps) => {
  const [step, setStep] = useState(0);
  const [dataState, setDataState] = useState<CoachOnboardingState>(() =>
    user ? mapUserToCoachState(user) : DEFAULT_STATE
  );

  useEffect(() => {
    setDataState(user ? mapUserToCoachState(user) : DEFAULT_STATE);
  }, [user]);

  const handleSave = async () => {
    try {
      await UserService.onboardUser(dataState);
      setOpen(false);
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  const next = () => {
    if (step === steps.length - 1) {
      handleSave();
    } else {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showMobileBack={false}
        className="bg-[#F9FAFB] p-0 rounded-none
      fixed inset-0 w-screen overflow-y-auto overscroll-contain
      md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto 
      md:w-[min(800px,calc(100vw-64px))] 
      md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:overflow-visible
    "
      >
        <DialogHeader className="flex flex-col gap-6 p-6">
          <DialogTitle className="flex items-center gap-2">
            <ProfileCoach /> Edit profile
          </DialogTitle>
          <div className="flex items-center max-w-[310px] no-scrollbar gap-4 p-2 overflow-x-auto bg-white border rounded-full md:max-w-full">
            {steps.map((s, i) => (
              <button
                key={s.id}
                className={cn(
                  "py-2.5 px-4 font-bold text-sm text-nowrap",
                  s.id === steps[step].id
                    ? "bg-[#F2F4F6] border rounded-full"
                    : undefined
                )}
                onClick={() => setStep(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 md:flex hidden">
          <StepBody
            id={steps[step].id}
            data={dataState}
            setDataState={setDataState}
          />
        </ScrollArea>

        <div className="block px-6 md:hidden">
          <StepBody
            id={steps[step].id}
            data={dataState}
            setDataState={setDataState}
          />
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-1 p-4 md:pt-8 md:p-6">
          <Button variant="blue2" onClick={close} className="w-32">
            Cancel
          </Button>

          <Button variant="brightblue" onClick={next} className="w-32">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
