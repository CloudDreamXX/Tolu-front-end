import { logout } from "entities/user";
import { useEffect, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (location.pathname === "/auth") return;

    const unsubscribe = store.subscribe(() => {
      if (hasLoggedOut.current) return;

      const state: any = store.getState();

      const apiSlices = Object.keys(state).filter(
        (key) =>
          state[key] &&
          typeof state[key] === "object" &&
          state[key].queries &&
          state[key].mutations
      );

      for (const sliceKey of apiSlices) {
        const slice = state[sliceKey];
        const all = { ...slice.queries, ...slice.mutations };

        for (const key in all) {
          const result = all[key];
          const error = result?.error;
          if (!error) continue;

          const status = error.status;
          const message =
            error.data?.detail ||
            error.data?.message ||
            error.data?.error ||
            "";

          if (
            status === 403 &&
            (message.toLowerCase().includes("token") ||
              message.toLowerCase().includes("authenticated"))
          ) {
            hasLoggedOut.current = true;
            unsubscribe();
            dispatch(logout());
            localStorage.clear();
            navigate("/auth", { replace: true });
            return;
          }
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, store]);

  return <>{children}</>;
};
