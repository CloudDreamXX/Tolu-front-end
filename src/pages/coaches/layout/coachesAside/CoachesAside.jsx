import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { ArrowIcon } from "../../../../assets/svgs/Icon";
import CoachesDashboardAside from './components/CoachesDashboardAside';
import CoachesLibraryTopicDetailsAside from './components/CoachesLibraryTopicDetailsAside';

function CoachesAside() {

  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const { pathname } = useLocation();  // Get the current route
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [chats, setChats] = useState([]);



  const asideToggleHandler = () => {
    setIsAsideOpen(!isAsideOpen);
  };
  const renderComponentBasedOnRoute = () => {
    switch (pathname) {
      case "/coaches":
        return (
          <CoachesDashboardAside isAsideOpen={isAsideOpen} />
        );
      case "/coaches/coaches-library-topic-details":
        return (
          <CoachesLibraryTopicDetailsAside />
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
      className={`h-full border-[#008FF614] border-r-2 shadow-[#8484850A] bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] ${isAsideOpen ? "w-[90px]" : "w-[280px]"}`
      }
    >
      <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
        <h6 className="text-3xl font-bold text-black">VITAI</h6>
      </div>
      <div
        className={`hidden xl:block absolute top-18 cursor-pointer transition-all text-primary duration-300 ${isAsideOpen ? "rotate-180 right-[-13%]" : "rotate-0 right-[-5%]"} `}
        onClick={asideToggleHandler}
      >
        <ArrowIcon />
      </div>
      {!isAsideOpen && (
        <div className="h-full overflow-auto  py-8 flex px-4 flex-col items-center justify-between  transition-all duration-700 ">

          {renderComponentBasedOnRoute()}


        </div>
      )}
    </div>
  )
}

export default CoachesAside