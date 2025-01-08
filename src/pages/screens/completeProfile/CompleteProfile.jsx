import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import Header from "../../../components/layout/Header";

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOne setCurrentStep={setCurrentStep} />;
      case 1:
        return <StepTwo setCurrentStep={setCurrentStep} />;
      case 2:
        return <StepThree setCurrentStep={setCurrentStep} />;
      case 3:
        return <StepFour setCurrentStep={setCurrentStep} />;

      default:
        return null;
    }
  };

  const steps = [
    {
      label: "Health Status",
      num: "step 1",
    },
    {
      label: "Life Style and Environmental Exposure",
      num: "step 2",
    },
    {
      label: "Health History and Symptom Assessment",
      num: "step 3",
    },
    {
      label: "Body System Health",
      num: "step 4",
    },
  ];
  return (
    <div>
      <Header />
      <div className="bg-white container mx-auto  rounded-[18px]  h-full  my-5">
        <div className="border p-5 shadow-sm rounded-xl space-y-5">
          <h1 className="text-primary font-extrabold text-xl md:text-3xl text-center">
            4-STEPS to Complete Profile
          </h1>
          <div className="flex items-center justify-center flex-wrap gap-4 ">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center  cursor-default  ${
                  currentStep >= index ? "opacity-100" : "opacity-50"
                } ${index < steps.length - 1 ? "" : ""}`}
              >
                <div className="flex flex-col  items-start text-primary ">
                  <p className="capitalize font-[700] text-xs">{step.num}</p>
                  <p className="text-base md:text-lg font-[800] hidden md:block">
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && <Arrow />}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 md:mt-8 border p-5 shadow-sm rounded-xl ">
          {renderStepContent(currentStep)}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;

const Arrow = () => {
  return (
    <div className="flex items-center justify-between mx-[10px]">
      <svg
        width="73"
        height="5"
        viewBox="0 0 73 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M70.5 2.5L2.5 2.5"
          stroke="#008FF6"
          strokeOpacity="0.24"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="10 10"
        />
      </svg>
    </div>
  );
};
