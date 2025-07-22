import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const navHistory: string[] = [];

export const useNavigationHistory = () => {
  const location = useLocation();

  useEffect(() => {
    navHistory.push(location.pathname);
  }, [location]);

  const findPreviousLibraryDocumentPath = (): string | null => {
    for (let i = navHistory.length - 2; i >= 0; i--) {
      if (navHistory[i].startsWith("/library/document")) {
        return navHistory[i];
      }
    }
    return null;
  };

  return { findPreviousLibraryDocumentPath };
};
