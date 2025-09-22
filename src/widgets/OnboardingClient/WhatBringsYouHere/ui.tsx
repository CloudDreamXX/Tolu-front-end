// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "entities/store";
// import { setFormField } from "entities/store/clientOnboardingSlice";
// import { UserService } from "entities/user";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, Slider } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { MultiSelect } from "widgets/health-profile-form/ui/MultiSelect";

const AREA_OPTIONS = [
  "Perimenopause",
  "Menopause / Post Menopause",
  "Hormone Health",
  "Gut Health",
  "Autoimmunity / Inflammation",
  "Metabolic / Weight Issues",
  "Sleep and Stress",
  "Emotional Well-being",
  "Chronic Illness Management",
  "General Wellness / Full Body Systems Optimization",
  "I’m not sure",
] as const;

const EXPERIENCE_OPTIONS = [
  "No, this is all new to me",
  "I’ve read or heard about it but not deeply",
  "I’ve tried working on it with a coach, practitioner, or on my own",
] as const;

export const WhatBringsYouHere = () => {
  const nav = useNavigate();
  // const dispatch = useDispatch();
  // const token = useSelector((s: RootState) => s.user.token);
  // const onboarding = useSelector((s: RootState) => s.clientOnboarding);
  const { isMobileOrTablet } = usePageWidth();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);

  // const selectedAreas: string[] = onboarding?.areas_selected ?? [];
  // const confidence: number = onboarding?.areas_confidence ?? 5;
  // const priorExperience: string = onboarding?.areas_prior_experience ?? "";

  // const onAreasChange = (vals: string[]) => {
  //   dispatch(setFormField({ field: "areas_selected", value: vals }));
  // };

  // const setConfidence = (val: number) => {
  //   const v = Math.min(5, Math.max(1, Number(val)));
  //   dispatch(setFormField({ field: "areas_confidence", value: v }));
  // }

  // const handleExperienceRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.value;
  //   dispatch(setFormField({ field: "areas_prior_experience", value: val }));
  // };

  // const isFilled = () => {
  //   const hasAreas = selectedAreas.length > 0;
  //   const hasConfidence = typeof confidence === "number" && confidence >= 1 && confidence <= 5;
  //   const hasExperience = !!priorExperience;
  //   return hasAreas && hasConfidence && hasExperience;
  // };

  const handleNext = async () => {
    // const payload = {
    //   ...onboarding,
    //   areas_selected: selectedAreas,
    //   areas_confidence: confidence,
    //   areas_prior_experience: priorExperience,
    // };

    try {
      // await UserService.onboardClient(payload, token);
      nav("/values");
    } catch (err) {
      console.error(err);
    }
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Client-Educator Alignment
    </h1>
  );

  const buttonsBlock = (
    <div className="flex justify-between items-center w-full max-w-[700px] flex-col-reverse gap-6 md:flex-row">
      <button
        onClick={() => nav("/barriers")}
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
      >
        Skip this for now
      </button>
      <div className="flex w-full gap-4 md:w-auto">
        <button
          onClick={() => nav(-1)}
          className="p-4  w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          // disabled={!isFilled()}
          // className={`p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold
          //   ${isFilled()
          //     ? "bg-[#1C63DB] text-white"
          //     : "bg-[#DDEBF6] text-white cursor-not-allowed"}
          //   `}
          className={`p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <AuthPageWrapper>
      <HeaderOnboarding isClient currentStep={1} steps={8} />
      <main className="flex flex-col items-center self-stretch justify-center gap-8">
        {!isMobileOrTablet && title}

        <div className="w-full max-w-[700px] flex gap-6 flex-col items-start justify-center rounded-t-3xl bg-white py-[24px] px-[16px] md:p-10 md:rounded-3xl">
          {isMobileOrTablet && title}

          <section className="flex flex-col gap-3 w-full">
            <h2 className="text-[18px] text-[#1D1D1F] font-bold">
              Do you have an idea which area your current symptoms are most
              related to?
            </h2>
            <p className="text-[16px] font-medium text-[#5F5F65]">
              Select all that apply.
            </p>

            <MultiSelect
              placeholder="Select"
              options={AREA_OPTIONS as unknown as string[]}
              selected={selectedAreas}
              onChange={(e) => setSelectedAreas(e)}
              // selected={selectedAreas}
              // onChange={onAreasChange}
            />
          </section>

          <section className="flex flex-col gap-3 w-full">
            <h2 className="text-[18px] text-[#1D1D1F] font-bold">
              How confident are you in your selection(s)?
            </h2>

            <div className="flex items-center justify-between text-[14px] text-[#5F5F65] font-medium">
              <span>Just guessing</span>
              <span>Somewhat confident</span>
              <span>Very confident</span>
            </div>

            <div className="w-full">
              <Slider
                min={1}
                max={5}
                step={1}
                value={[confidence]}
                onValueChange={([e]) => setConfidence(e)}
                className="w-full"
                colors={Array(5).fill("#1C63DB")}
              />
              <div className="flex justify-between mt-2 text-xs text-[#1D1D1F] font-[12px]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 w-full">
            <h2 className="text-[18px] text-[#1D1D1F] font-bold">
              Have you ever learned about or worked on these areas before?
            </h2>

            <div className="flex flex-col gap-4">
              {EXPERIENCE_OPTIONS.map((opt, idx) => {
                const id = `exp-${idx}`;
                return (
                  <div key={opt} className="flex items-center h-6 gap-4">
                    <input
                      id={id}
                      name="areas_experience"
                      type="radio"
                      className="flex items-center w-6 h-6"
                      value={opt}
                      // checked={priorExperience === opt}
                      // onChange={handleExperienceRadio}
                    />
                    <label
                      htmlFor={id}
                      className="text-[16px] font-medium text-[#1D1D1F] cursor-pointer"
                    >
                      {opt}
                    </label>
                  </div>
                );
              })}
            </div>
          </section>

          {isMobileOrTablet && buttonsBlock}
        </div>

        {!isMobileOrTablet && buttonsBlock}
      </main>

      <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
