type StepStyleProps = {
  isCompleted: boolean;
  isCurrent: boolean;
  isMobile: boolean;
};

export function getStepStyle({
  isCompleted,
  isCurrent,
  isMobile,
}: StepStyleProps) {
  if (isCompleted) {
    return {
      backgroundColor: "#1866E0",
      color: "white",
      border: isMobile ? "0" : "3px solid #1866E0",
      boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.2)",
      fontWeight: "700",
      fontSize: isMobile ? "12px" : "14px",
    };
  }

  if (isCurrent) {
    return {
      color: "#5F5F65",
      backgroundColor: "white",
      border: isMobile ? "0" : "3px solid #1866E0",
      boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.2)",
      fontWeight: "700",
      fontSize: isMobile ? "12px" : "14px",
    };
  }

  return {
    backgroundColor: "#D9D9D9",
    color: "#5F5F65",
    border: "3px solid #D9D9D9",
    boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.2)",
    fontWeight: "700",
    fontSize: isMobile ? "12px" : "14px",
  };
}

// boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.2)",
//                 color: isCompleted ? "white" : "#5F5F65",
//                 fontWeight: "700",
//                 fontSize: "14px",
