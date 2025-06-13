import React, { useEffect, useState } from "react";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";

interface StepperWithLabelsProps {
  steps: string[];
  activeStep: number;
  getLabel: (step: string) => string;
}

export const StepperWithLabels: React.FC<StepperWithLabelsProps> = ({
  steps,
  activeStep,
  getLabel,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const StepIconRoot = styled("div")<{
    ownerState: { active: boolean; completed: boolean };
  }>(({ ownerState }) => ({
    backgroundColor: ownerState.completed
      ? "#BCE2C8"
      : ownerState.active
        ? "#ECEFF4"
        : "#FFF",
    zIndex: 1,
    width: 40,
    height: 40,
    color: ownerState.completed
      ? "#006622"
      : ownerState.active
        ? "#1D1D1F"
        : "#5F5F65",
    display: "flex",
    borderRadius: "50%",
    border: `1px solid ${ownerState.completed ? "#006622" : "#D5DAE2"}`,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  }));

  const CustomStep = styled(Step)(() => ({
    paddingLeft: 0,
    paddingRight: 0,
  }));

  const CustomStepIcon = (props: any) => {
    const { active, completed, className, icon } = props;
    return (
      <StepIconRoot ownerState={{ completed, active }} className={className}>
        {completed ? <Check fontSize="small" /> : icon}
      </StepIconRoot>
    );
  };

  const CustomConnector = styled(StepConnector)(() => ({
    position: "absolute",
    top: 20,
    width: "100%",
    margin: "0 auto",
    left: -45,
    right: 0,
    "& .MuiStepConnector-line": {
      borderColor: "#D5DAE2",
      borderTopWidth: 1,
      borderRadius: 1,
    },
  }));

  return (
    <div className="border border-[#D5DAE2] rounded-[32px] p-[6.5px] md:p-[8px] bg-white">
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
      >
        {steps.map((step, index) => (
          <CustomStep key={step}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              {activeStep === index && (
                <div
                  className={`${
                    /^\d+$/.test(getLabel(step))
                      ? "w-[40px]"
                      : "w-[150px] md:w-[480px] lg:w-[486px]"
                  } bg-[#ECEFF4] border border-[#D5DAE2] text-[#1D1D1F] h-[40px] text-[14px] leading-[140%] font-[600] rounded-[32px] flex items-center justify-center px-[8px] py-[8px] md:px-[16px] md:py-[10px] -mt-[56px] z-10 relative`}
                >
                  {getLabel(step)}
                </div>
              )}
            </StepLabel>
          </CustomStep>
        ))}
      </Stepper>
    </div>
  );
};
