import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="  bg-white  p-5 ">
      <Outlet />
    </div>
  );
};

export default Main;
