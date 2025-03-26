import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../aside/Aside";
import Header from "../header/Header";
import Tray from "../../shared/ui/Tray";
import { trayMock } from "./mock";
import Button from "../../shared/ui/Button";

function PostLayout() {
  return (
    <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
      <div className="flex flex-col-2 h-full">
        <div className="hidden xl:block z-50">
          <Aside />
        </div>
        <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
          <Header />
          <div className="flex flex-col md:gap-4 p-4 lg:p-6 w-full">
            <Button 
              name="Back"
              type="back"
              onClick={() => window.history.back()}
            />
            <div className="w-full flex flex-col md:flex-row gap-4">
              <Outlet />
              <Tray trayItems={trayMock} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PostLayout;
