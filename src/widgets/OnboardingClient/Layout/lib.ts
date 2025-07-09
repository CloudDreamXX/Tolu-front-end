import { useEffect, useState } from "react";

export const useScreenHeight = () => {
  const [isTallScreen, setIsTallScreen] = useState(false);

  useEffect(() => {
    const updateHeight = () => {
      setIsTallScreen(window.innerHeight > 800);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return isTallScreen;
};
