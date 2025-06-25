import { Step, StepConnector, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";
import React from "react";
import { Step as StepType } from "../../mock";

interface ModalStepperProps {
  steps: StepType[];
  currentStep: number;
  isMobile: boolean;
  isTablet: boolean;
}

const DefaultConnector = styled(StepConnector)<{ isMobile: boolean }>(
  ({ isMobile }) => ({
    top: isMobile ? "16px" : 20,
    left: isMobile ? "calc(-50% + 16px)" : "calc(-50% + 20px)",
    right: isMobile ? "calc(50% + 16px)" : "calc(50% + 20px)",
    "& .MuiStepConnector-line": {
      borderColor: "#D5DAE2",
      borderTopWidth: 1,
      borderRadius: 1,
    },
  })
);

const WideConnector = styled(StepConnector)<{
  isMobile: boolean;
  isTablet: boolean;
}>(({ isMobile, isTablet }) => ({
  position: "absolute",
  top: isMobile ? "16px" : 20,
  left: isMobile ? "-70px" : isTablet ? "-42px" : "-30px",
  right: 0,
  margin: "0 auto",
  width: "100%",
  maxWidth: "580px",
  "& .MuiStepConnector-line": {
    borderColor: "#D5DAE2",
    borderTopWidth: 1,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled("div")<{ ownerState: any; isMobile: boolean }>(
  ({ ownerState, isMobile }) => ({
    backgroundColor: ownerState.completed
      ? "#BCE2C8"
      : ownerState.active
        ? "#ECEFF4"
        : "#FFF",
    zIndex: 1,
    width: isMobile ? 32 : 40,
    height: isMobile ? 32 : 40,
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
  })
);

const CustomStep = styled(Step)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
}));

const CustomStepIcon = (props: any) => {
  const { active, completed, className, isMobile } = props;
  const { icon } = props;

  return (
    <StepIconRoot
      ownerState={{ completed, active }}
      className={className}
      isMobile={isMobile}
    >
      {completed ? <Check fontSize="small" /> : icon}
    </StepIconRoot>
  );
};

export const ModalStepper: React.FC<ModalStepperProps> = ({
  steps,
  currentStep,
  isMobile,
  isTablet,
}) => {
  return (
    <div className="border border-[#D5DAE2] rounded-[32px] p-[6.5px] md:p-[8px]">
      <Stepper
        activeStep={currentStep}
        alternativeLabel
        connector={
          currentStep === 1 || currentStep === 2 ? (
            <WideConnector isMobile={isMobile} isTablet={isTablet} />
          ) : (
            <DefaultConnector isMobile={isMobile} />
          )
        }
      >
        {steps.map((step, index) => (
          <CustomStep key={index}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} isMobile={isMobile} />
              )}
            >
              {index === currentStep && (
                <div className="w-max max-w-[107px] md:max-w-[266px] md:w-[266px] lg:max-w-[358px] lg:w-[358px] bg-[#ECEFF4] border border-[#D5DAE2] text-[#1D1D1F] text-[10px] md:text-[14px] leading-[16.411px] md:leading-[20px] text-wrap md:text-nowrap font-[600] rounded-[32px] flex items-center justify-center px-[12px] min-w-[82px] min-h-[32px] md:px-[16px] md:py-[10px] -mt-[48px] md:-mt-[57px] z-10 relative">
                  {step.stepTitle}
                </div>
              )}
            </StepLabel>
          </CustomStep>
        ))}
      </Stepper>
    </div>
  );
};
