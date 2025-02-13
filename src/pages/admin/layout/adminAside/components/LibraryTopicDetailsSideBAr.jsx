import React, { useState } from 'react';
import { CiShop } from "react-icons/ci";
import { IoHomeOutline, IoLibraryOutline, IoLibrarySharp } from "react-icons/io5";
import { LiaHistorySolid } from "react-icons/lia";
import { MdHome } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { ArrowIcon } from '../../../../../assets/svgs/Icon';

// Reusable Section Component
const SidebarSection = ({ Icon, text, onClick, extraClasses = "" }) => {
  return (
    <section
      onClick={onClick}
      className={`w-full text-black p-4 text-sm font-normal rounded-xl mt-2 hover:bg-[#ACACAC] flex items-center gap-2 cursor-pointer ${extraClasses}`}
    >
      <section>
        <Icon className='text-xl' />
      </section>
      <section>
        <text>{text}</text>
      </section>
    </section>
  );
};

function LibraryTopicDetailsSideBAr() {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const navigate = useNavigate(); // React Router navigate

  const asideToggleHandler = () => {
    setIsAsideOpen(!isAsideOpen);
    setIsHistory(false); // Optionally reset history toggle on aside toggle
  };

  const showHistoryHandel = () => {
    setIsHistory(!isHistory);
  };

  // Navigation functions
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`h-full border-[#008FF614] border-r-2 bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] 
        ${isAsideOpen ? "w-[90px]" : "w-[280px]"} shadow-md shadow-[#7090B024]`}
    >
      <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
        <h6 className="text-3xl font-bold text-black">VITAI</h6>
      </div>
      <div
        className={`hidden xl:block absolute top-15 cursor-pointer transition-all duration-300 ${isAsideOpen ? "rotate-180 right-[-13%]" : "rotate-0 right-[-5%]"}`}
        onClick={asideToggleHandler}
      >
        <ArrowIcon />
      </div>

      {!isAsideOpen && (
        <section className="w-full flex flex-col p-4 items-center justify-center">
          <SidebarSection
            Icon={IoHomeOutline}
            text="Dashboard"
            onClick={() => navigateTo('/dashboard')}
          />
          <SidebarSection
            Icon={IoLibraryOutline}
            text="Library"
            onClick={() => navigateTo('/library')}
          />
          <SidebarSection
            Icon={CiShop}
            text="Health Shop"
            onClick={() => navigateTo('/health-shop')}
          />
          <SidebarSection
            Icon={LiaHistorySolid}
            text="History"
            onClick={showHistoryHandel}
          />
          {isHistory && (
            <>
              <SidebarSection
                Icon={MdHome}
                text="Homepage"
                onClick={() => navigateTo('/home')}
              />
              <SidebarSection
                Icon={IoLibrarySharp}
                text="Library"
                onClick={() => navigateTo('/library')}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default LibraryTopicDetailsSideBAr;
