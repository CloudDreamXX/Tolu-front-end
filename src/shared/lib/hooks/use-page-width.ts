import { useEffect, useState } from "react";

export const usePageWidth = () => {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const isMobile = pageWidth < 768;
  const isTablet = pageWidth >= 768 && pageWidth < 1024;
  const isMobileOrTablet = pageWidth < 1024;

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { pageWidth, isMobile, isTablet, isMobileOrTablet };
};
