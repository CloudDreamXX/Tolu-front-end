import { logout } from "entities/user";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStore } from "react-redux";

export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (location.pathname === "/auth") return;
    // Subscribe to RTK Query error updates
    const unsubscribe = store.subscribe(() => {
      const state: any = store.getState();
      const queries = state.userApi?.queries ?? {};
      const mutations = state.userApi?.mutations ?? {};

      // Combine queries + mutations so we can inspect all
      const all = { ...queries, ...mutations };

      for (const key in all) {
        const result = all[key];
        const error = result?.error;
        if (!error) continue;

        const status = error.status;
        const message =
          error.data?.detail || error.data?.message || error.data?.error || "";

        if (
          (status === 401 || status === 403) &&
          message.toLowerCase().includes("token")
        ) {
          dispatch(logout());
          localStorage.clear();
          navigate("/auth", { replace: true });
          break;
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, store]);

  return <>{children}</>;
};
