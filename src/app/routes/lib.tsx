import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { Auth } from "pages/auth";
import { setLoading } from "entities/user";
import { ProtectedRoute } from "./ui";
import { Home } from "pages/home";

export const AppRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, dispatch]);

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
