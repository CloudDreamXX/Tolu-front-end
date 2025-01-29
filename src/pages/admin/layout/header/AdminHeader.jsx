import React, { useEffect, useRef, useState } from "react";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
// // import {
// //   RingIcon,
//   HeaderChevronIcon,
// //   HamburgerIcon,
// //   BuildingIcon,
// //   BookedIcon,
// //   FreeSlotsIcon,
// // } from "../../assets/svgs/Icon";
// import Aside from "../aside/Aside";
import Notification from "./Notification";
import { IoHomeOutline } from "react-icons/io5";
import { IoLibraryOutline } from "react-icons/io5";
import { CiShop } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { FaHeadset } from "react-icons/fa";
// import { HeaderChevronIcon } from "../../assets/svgs/Icon";
import { IoIosArrowDown } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import Aside from "../../../../layout/aside/Aside";
// import Aside from "../aside/Aside";

import { IoIosSearch } from "react-icons/io";



const AdminHeader = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const notificationRef = useRef();
  const profileRef = useRef();
  const { pathname } = useLocation();
  const pathSplit = pathname.split("/");
  const page = pathSplit[pathSplit.length - 1];
  const pageName = page.split("-").join(" ");

  const mobileNavHandler = () => setMobileNav(!mobileNav);

  const notificationOpenHandler = (e) => {
    setIsNotificationOpen(!isNotificationOpen);
    if (profileRef.current && notificationRef.current.contains(e.target)) {
      setIsProfileOpen(false);
    }
  };

  const profileOpenHandler = (e) => {
    setIsProfileOpen(!isProfileOpen);
    if (notificationRef.current && profileRef.current.contains(e.target)) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notificationRef, profileRef]);



  const [activeIndex, setActiveIndex] = useState(null);

  // Handle click to set the active index
  const handleClick = (index) => {
    setActiveIndex(index);
  };

  // Function to return classes dynamically based on active index
  const getClassNames = (index) => {
    return `flex items-center text-center text-base font-normal rounded-lg gap-3 ${index === activeIndex
      ? 'border-2 border-[#25252526] shadow-md shadow-[#00000026] p-2' // Active styles
      : 'border-2 border-transparent shadow-none p-2' // Default styles
      }`;
  };




  return (
    <header className="h-[200px] shadow-[#008FF60A] bg-white border sm:h-[100px] p-4 flex flex-col justify-between gap-6">
      <div className="flex items-center justify-between gap-6">
        <div className=" block xl:hidden">
          <div
            className="bg-primary p-2 rounded-md cursor-pointer block xl:hidden"
            onClick={mobileNavHandler}
          >
            {/* <HamburgerIcon /> */}
            <IoMenu />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 shadow-[#7090B014] border border-[#ACACAC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1F99]">
              <IoIosSearch className="text-2xl font-bold" />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 xl:gap-6">

          <div className="bg-[#CBCBCB] w-[40px] h-[40px] py-2  rounded-full flex items-center justify-center gap-2">
            <FaHeadset className="text-white" />
          </div>
          <div className="bg-[#ffffff80] py-2 px-5 rounded-lg flex items-center justify-center gap-2 relative">
            <div className="w-[42px] h-[42px] bg-[#CBCBCB] flex justify-center items-center rounded-full overflow-hidden">

              <img
                src="https://placehold.co/600x400/white/18bc9c?text=AZ"
                alt="image"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="  text-sm font-bold text-black">Kate Smith</p>
              <p className="text-[9px] font-normal text-black">Kate@gamil.com</p>
            </div>
            <div
              className="flex items-center gap-2 text-[#CBCBCB] text-2xl font-semibold cursor-pointer"
              onClick={profileOpenHandler}
              ref={profileRef}
            >
              <div
                className={`transition-all duration-400 ${isProfileOpen ? "rotate-180" : "rotate-0"
                  }`}
              >
                <IoIosArrowDown />
              </div>
            </div>
            <div
              onClick={profileOpenHandler}
              className={`absolute top-[45px] right-0 border-2 border-[#e4e4e43b] w-[150px] shadow-md rounded-lg custom-scroll transition-all duration-400 ${isProfileOpen
                ? "h-[76px] opacity-100"
                : "h-0 invisible opacity-0"
                }`}
            >
              <Profile />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`block xl:hidden fixed w-full h-full inset-0 bg-[#00000071] z-50 transition-all duration-500 ${mobileNav
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileNav(false)}
      >
        <div
          className={`absolute top-3 left-3 h-full transition-transform duration-500 ${mobileNav ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Aside />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

const Profile = () => {
  return (
    <div className="w-full">
      <Link to="profile" className="flex items-center justify-between gap-4 px-2 py-2 border-b bg-white rounded-t-md hover:bg-[#b6feef]">
        <h6 className="text-[13px] font-medium">My Profile</h6>
        <IoChevronForwardOutline fontSize={18} />
      </Link>
      <div className="flex items-center justify-between gap-4 px-2 py-2 cursor-pointer bg-white rounded-b-md hover:bg-[#b6feef]">
        <h6 className="text-[13px] font-medium">Logout</h6>
        <IoLogOutOutline fontSize={18} />
      </div>
    </div>
  );
};

const HeaderData = ({ data }) => {
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 md:gap-8 bg-[#FFFFFFCC] rounded-lg py-2 px-4">
      <div className="flex items-center gap-1">
        {/* <BuildingIcon /> */}
        <h6 className="text-[10px] sm:text-sm font-medium text-[#414141]">
          Total Number of Parking Slots: <span className="font-bold">1204</span>
        </h6>
      </div>
      <div className="flex items-center gap-1">
        {/* <BookedIcon /> */}
        <h6 className="text-[10px] sm:text-sm font-medium text-[#414141]">
          Booked: <span className="font-bold">440</span>
        </h6>
      </div>
      <div className="flex items-center gap-1">
        {/* <FreeSlotsIcon /> */}
        <h6 className="text-[10px] sm:text-sm font-medium text-[#414141]">
          Free Slots: <span className="font-bold">1204</span>
        </h6>
      </div>
    </div>
  );
};
