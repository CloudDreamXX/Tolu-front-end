import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper } from "shared/ui";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { Card } from "./Card";
import { BottomButtons } from "widgets/BottomButtons";

export const ChooseTest = () => {
  const nav = useNavigate();
  const [activeCard, setActiveCard] = useState("16Personalities");
  const [visited, setVisited] = useState(false);

  const desc1 = (
    <>
      The 16 Personalities test is a popular psychological assessment based on
      the
      <br /> Myers-Briggs Type Indicator (MBTI) and Carl Jung’s theories. It
      categorizes <br /> individuals into 16 personality types.
    </>
  );

  const desc2 = (
    <>
      The Enneagram is a personality system that identifies nine core types,
      each
      <br /> representing a different way of thinking, feeling, and behaving. It
      focuses on core <br /> motivations, fears, and desires to explain how
      people relate to themselves and
      <br /> others.
    </>
  );

  const handleNext = () => {
    if (visited) {
      nav("/readiness");
    } else if (activeCard === "16Personalities") {
      setVisited(true);
      window.open(
        "https://www.16personalities.com/free-personality-test ",
        "_blank"
      );
    } else if (activeCard === "Enneagram") {
      setVisited(true);
      window.open("https://enneagramtest.com/test ", "_blank");
    }
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding isClient currentStep={5} steps={8} />
      <main className="flex flex-col w-full items-center gap-8 justify-center self-stretch">
        <div className="flex flex-col items-center">
          <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
            Choose test
          </h1>
          <p className="text-[#AAC6EC] text-[18px] font-bold ">(Optional)</p>
        </div>
        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <Card
            title="16Personalities"
            description={desc1}
            active={activeCard === "16Personalities"}
            onClick={() => setActiveCard("16Personalities")}
          />
          <Card
            title="Enneagram"
            description={desc2}
            active={activeCard === "Enneagram"}
            onClick={() => setActiveCard("Enneagram")}
          />
        </div>
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/readiness")}
          isButtonActive={() => activeCard.length > 0}
        />
      </main>
    </AuthPageWrapper>
  );
};
