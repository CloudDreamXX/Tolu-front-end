import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className=" bg-white px-4 h-{calc(100% - 70px) ">
      <Outlet />
    </div>
  );
};

export default Main;
