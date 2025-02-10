import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  // Import useLocation
import { ArrowIcon } from "../../assets/svgs/Icon";
import AsideDropDown from "./AsideDropDown";
import Button from "../../components/small/Button";
import { TbLogout2 } from "react-icons/tb";
import { allSymptoms, bodySystem, conditions, healthProtocols, herbsAndSupplements, lifestyleChanges, tests } from "../../assets/data";
import ChatHistory from "../../pages/screens/chat/ChatHistory";
import Dashboard from "./components/Dashboard";
import Chat from "./components/chat";

const Aside = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const { pathname } = useLocation();  // Get the current route
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [chats, setChats] = useState([]);



  const asideToggleHandler = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  const renderComponentBasedOnRoute = () => {
    switch (pathname) {
      case "/user":
        return (
          <Dashboard />
        );
      case "/user/chat":
        return (
          <Chat isAsideOpen={isAsideOpen} />
        );
      case "/user/profile":
        return (
          <Chat />
          
        );
      case "/settings":
        return (
          <AsideDropDown
            name="Account Settings"
            options={[]}
            onCheckedChange={() => { }} // Replace with actual data when needed
          />
        );
      case "/notifications":
        return (
          <AsideDropDown
            name="Notification Settings"
            options={[]}
            onCheckedChange={() => { }} // Replace with actual data when needed
          />
        );
      default:
        return null; // Or a default component if needed
    }
  };



  return (
    <div
      className={`h-full border-[#008FF614] border-r-2 shadow-[#8484850A] bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] ${isAsideOpen ? "w-[90px]" : "w-[220px]"}`
      }
    >
      <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
        <h6 className="text-3xl font-bold text-black">VITAI</h6>
      </div>
      <div
        className={`hidden xl:block absolute top-18 cursor-pointer transition-all duration-300 ${isAsideOpen ? "rotate-180 right-[-13%]" : "rotate-0 right-[-5%]"} `}
        onClick={asideToggleHandler}
      >
        <ArrowIcon />
      </div>
      {!isAsideOpen && (
        <div className="h-full  py-8 flex px-2 flex-col items-center justify-between  transition-all duration-700 ">

          {renderComponentBasedOnRoute()}

          {/* <Button className={" !bg-white !border-[1px] border-[#008FF633] shadow-[0px_4px_6px_#7090B01F]   text-[#ACACAC]"} text="Log Out" width="w-full" >
            <TbLogout2 />
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default Aside;
