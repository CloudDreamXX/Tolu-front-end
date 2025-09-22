import { logout } from "entities/user";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleError = (
      event: CustomEvent<{ status?: number; message?: string }>
    ) => {
      if (
        location.pathname === "/about-you" ||
        location.pathname === "/select-type"
      )
        return;

      const status = event.detail?.status;
      const msg = (event.detail?.message ?? "").toLowerCase();
      if (
        (status === 403 || status === 401) &&
        (msg.includes("invalid token") || msg.includes("expired token"))
      ) {
        dispatch(logout());
        localStorage.clear();
        navigate("/auth", { replace: true });
      }
    };
    window.addEventListener("api-error", handleError as EventListener);
    return () =>
      window.removeEventListener("api-error", handleError as EventListener);
  }, [navigate]);

  return <>{children}</>;
};
