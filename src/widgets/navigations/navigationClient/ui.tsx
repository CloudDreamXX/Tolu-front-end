import { logout } from "entities/user";
import { User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Chat from "shared/assets/icons/chat";
import ChatsCircle from "shared/assets/icons/chats-circle";
import Heartbeat from "shared/assets/icons/heartbeat";
import Library from "shared/assets/icons/library";
import Menu from "shared/assets/icons/menu";
import Message from "shared/assets/icons/message";
import ProfileIcon from "shared/assets/icons/profile";
import SignOutIcon from "shared/assets/icons/signout";

export const NavigationClient: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSignOut = () => {
    console.log("Sign out clicked");
    dispatch(logout());
    nav("/auth");
  };

  return (
    <div className="flex bg-white flex-row items-center justify-center h-[78px] gap-[30px] relative px-[48px] py-[19px]">
      <div className="flex flex-row gap-[30px] w-full">
        <NavLink
          to={"/health-snapshot"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${
              isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Heartbeat />
          Health Snapshot
        </NavLink>

        <NavLink
          to={"/library"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${
              isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Library />
          Library
        </NavLink>

        <NavLink
          to={"/messages"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${
              isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <ChatsCircle />
          Messages
        </NavLink>
      </div>

      {/* Hamburger menu with dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          // aria-label="Toggle menu"
          className="p-2 transition-colors duration-200"
        >
          <Menu className={menuOpen ? "text-[#1C63DB]" : "text-black"} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-3
             flex flex-col gap-2 z-50
             before:absolute before:-top-2 before:right-4 before:border-8 before:border-transparent before:border-b-white"
            style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                nav("/profile");
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                <User size={24} />
              </div>
              Profile
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                <SignOutIcon />
              </div>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
