import { Outlet, Navigate } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//   // Read authentication data synchronously
//   const token = localStorage.getItem("token");
//   const userType = localStorage.getItem("userType")
//     ? JSON.parse(localStorage.getItem("userType"))
//     : null;

//   // If the user is not logged in...
//   if (!token || !userType) {
//     // ...and the route is for guests, allow access
//     if (allowedRoles.includes("guest")) {
//       return <Outlet />;
//     }
//     // Otherwise, redirect to the login page (or home page)
//     return <Navigate to="/auth" replace />;
//   }

//   // If the user is logged in, determine the user's role
//   const role = userType.role;

//   // If the route is for guests but the user is logged in, redirect them
//   if (allowedRoles.includes("guest")) {
//     return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
//   }

//   // If the user’s role is permitted, render the nested route(s)
//   if (allowedRoles.includes(role)) {
//     return <Outlet />;
//   }

//   // Otherwise, redirect to the appropriate home page
//   return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
// };


const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType")
    ? JSON.parse(localStorage.getItem("userType"))
    : null;

  if (!token || !userType) {
    if (allowedRoles.includes("guest")) {
      return <Outlet />;
    }
    return <Navigate to="/auth" replace />;
  }

  const role = userType.role;

  if (allowedRoles.includes("guest")) {
    return <Navigate to={role === "admin" ? "/admin" : role === "coaches" ? "/coaches" : "/user"} replace />;
  }

  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to={role === "admin" ? "/admin" : role === "coaches" ? "/coaches" : "/user"} replace />;
};


export default ProtectedRoute;
