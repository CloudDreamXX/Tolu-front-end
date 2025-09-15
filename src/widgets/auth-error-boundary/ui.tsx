import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: CustomEvent) => {
      if (
        event.detail?.status === 401 ||
        event.detail?.message.toLowerCase().includes("invalid token") ||
        event.detail?.message.toLowerCase().includes("expired token")
      ) {
        localStorage.clear();
        navigate("/auth", { replace: true });
      }
    };

    window.addEventListener("api-error", handleError as EventListener);
    return () => {
      window.removeEventListener("api-error", handleError as EventListener);
    };
  }, [navigate]);

  return <>{children}</>;
};
