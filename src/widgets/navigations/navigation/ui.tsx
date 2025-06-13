import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Menu from "shared/assets/icons/menu";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "entities/user";
import SignOutIcon from "shared/assets/icons/signout";
import Close from "shared/assets/icons/close";
import { Input } from "shared/ui/input";
import Search from "shared/assets/icons/search";
import Chevron from "shared/assets/icons/chevron";
import { sideBarContent } from "widgets/sidebars/ui/content-manager/lib";

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [menuMobOpen, setMenuMobOpen] = useState(false);
  const menuMobRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1280);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setMenuMobOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, menuMobOpen]);

  const handleSignOut = () => {
    dispatch(logout());
    nav("/auth");
  };

  if (location.pathname === "/content-manager/create" && isDesktop) return null;

  return (
    <div className="bg-white xl:bg-transparent flex flex-row items-center justify-center xl:h-[78px] gap-[30px] relative px-[16px] py-[12px] md:px-[24px] md:py-[16px] xl:px-[48px] xl:py-[19px]">
      {/* Mobile Hamburger */}
      <div className="flex items-center justify-between w-full xl:hidden">
        <div className="flex flex-col">
          <h1 className="text-[32px] md:text-[40px] font-[700] h-[40px] md:h-[50px] font-open leading-normal">
            TOLU
          </h1>
          <p className="text-[16px] md:text-[18px] font-[700] h-[21px] md:h-[27px] font-open leading-normal">
            Practitioner Admin
          </p>
        </div>
        <button onClick={() => setMenuMobOpen(true)} aria-label="Open menu">
          <Menu className="text-black w-[32px] md:w-[40px]" />
        </button>
      </div>

      {/* Full-screen Drawer */}
      {menuMobOpen && (
        <div className="fixed inset-0 bg-[#F1F3F5] top-[70px] md:top-0 md:bg-black md:bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="fixed top-0 right-0 bottom-0 left-0 bg-white z-[999] p-[16px] flex flex-col 
             md:w-[390px] md:right-[10px] md:top-[10px] md:bottom-[10px] md:left-auto md:rounded-[16px]"
            ref={menuMobRef}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col items-center">
                <h1 className="text-[32px] md:text-[40px] font-[700] font-open leading-normal">
                  TOLU
                </h1>
                <p className="text-[16px] md:text-[18px] font-[700] font-open leading-normal">
                  Practitioner Admin
                </p>
              </div>
              <button
                onClick={() => setMenuMobOpen(false)}
                aria-label="Close menu"
                className="absolute top-[16px] right-[16px]"
              >
                <span className="text-2xl font-bold">
                  <Close />
                </span>
              </button>
            </div>
            <Input
              placeholder="Search"
              icon={<Search className="ml-[16px]" />}
              iconRight={<Chevron className="mr-[16px]" />}
              className="rounded-full px-[54px]"
            />
            <div className="flex flex-col gap-4 mt-6">
              {sideBarContent.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.link}
                  onClick={() => setMenuMobOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 text-lg font-semibold rounded-md ${
                      isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
                    } hover:text-[#1C63DB]`
                  }
                >
                  {link.icon}
                  <span>{link.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative hidden ml-auto xl:flex">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          // aria-label="Toggle menu"
          className="transition-colors duration-200"
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
              className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
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
              className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
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
