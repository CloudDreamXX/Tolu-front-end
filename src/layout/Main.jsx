import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="  bg-white pt-28  p-2 ">
      <Outlet />
    </div>
  );
};

export default Main;
