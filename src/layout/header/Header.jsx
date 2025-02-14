import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
// // import {
// //   RingIcon,
//   HeaderChevronIcon,
// //   HamburgerIcon,
// //   BuildingIcon,
// //   BookedIcon,
// //   FreeSlotsIcon,
// // } from "../../assets/svgs/Icon";
import Aside from "../aside/Aside";
import Notification from "./Notification";
import { IoHomeOutline } from "react-icons/io5";
import { IoLibraryOutline } from "react-icons/io5";
import { CiShop } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { FaHeadset } from "react-icons/fa";
import { HeaderChevronIcon } from "../../assets/svgs/Icon";
import { IoIosArrowDown } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import toast from "react-hot-toast";


const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const notificationRef = useRef();
  const profileRef = useRef();
  const { pathname } = useLocation();
  const pathSplit = pathname.split("/");
  const page = pathSplit[pathSplit.length - 1];
  const pageName = page.split("-").join(" ");
  const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
  console.log(user);
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
  // const getClassNames = (index) => {
  //   return `flex items-center text-center text-base font-normal rounded-lg gap-3 ${index === activeIndex
  //     ? 'border-2 border-[#25252526] shadow-md shadow-[#00000026] p-2' // Active styles
  //     : 'border-2 border-transparent shadow-none p-2' // Default styles
  //     }`;
  // };
  const navItems = [
    { id: 0, name: "MY Space", path: "/user", icon: <IoHomeOutline /> },
    { id: 1, name: "Library", path: "/user/library", icon: <IoLibraryOutline /> },
    { id: 2, name: "Health Shop", path: "#", icon: <CiShop /> },
    { id: 3, name: "Search History", path: "/user/chat", icon: <MdHistory /> }
  ];

  const getClassNames = (path) => {
    return `flex items-center text-center text-base font-normal rounded-lg gap-3 ${location.pathname === path
        ? "border-2 border-[#25252526] shadow-md shadow-[#00000026] p-2"
        : "border-2 border-transparent shadow-none p-2"
      }`;
  };



  return (
    <header className="sticky top-0 left-0 w-full z-40 bg-gray-50 h-[70px] p-4 flex flex-col justify-between gap-6">
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
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.id} className={getClassNames(item.path)}>
                <a href={item.path} className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
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
              <p className="text-sm font-bold text-black">{user.name || "Name"}</p>
              <p className="text-[9px] font-normal text-black">{user.email || "Email"}</p>
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

export default Header;

const Profile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    toast.success("logged out successfully")
    localStorage.clear(); // 🛠 Clear everything instead of removing one by one
    window.location.replace("/auth");
  }
  return (
    <div className="w-full">
      <Link to="profile" className="flex items-center justify-between gap-4 px-2 py-2 border-b bg-white rounded-t-md hover:bg-[#b6feef]">
        <h6 className="text-[13px] font-medium">My Profile</h6>
        <IoChevronForwardOutline fontSize={18} />
      </Link>
      <div onClick={handleLogout} className="flex items-center justify-between gap-4 px-2 py-2 cursor-pointer bg-white rounded-b-md hover:bg-[#b6feef]">
        <h6 className="text-[13px] font-medium">Logout</h6>
        <IoLogOutOutline fontSize={18} />
      </div>
    </div>
  );
};
