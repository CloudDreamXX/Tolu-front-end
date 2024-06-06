import React from "react";
import { Layout, Dropdown, Button } from "antd";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BsCalendar2Fill } from "react-icons/bs";
import { BiSolidMessageAdd } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { GiPin } from "react-icons/gi";
import { FaMessage } from "react-icons/fa6";
import { FaRegListAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from 'react-icons/io';
import { RiMedicineBottleFill } from "react-icons/ri";
import { BiInjection } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { PiPersonSimpleWalk } from "react-icons/pi";
import { BiListPlus } from "react-icons/bi";
import { IoBagOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const SideBar = ({ className }) => {
  let collapse = useSelector((state) => state.collapse.value);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear()
    navigate("/");        
  };
  const isActive = (path) => {
    return location.pathname === path;
  };

  const items = [
    {
      key: "1",
      label: "Edit Profile",
      style: {
        borderRadius: "0px",
      },
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        sessionStorage.clear();
        navigate("/");
      },
    },
  ];

  return (
    <>
      <Sider
        width={260}
        hidden={!collapse}
        breakpoint="lg"
        collapsedWidth="200"
        className={`box1 ${className ? className : ''}`}
      >
        <h3 className="vita-heading">VITA GUIDE</h3>
        <div className={`mt-5 ${className ? "sidebar_text" : ''}`}>
          <Link className={`text-decor side ${isActive('/newsearch') ? 'active' : ''}`} to="/newsearch">
            <BiSolidMessageAdd />
            <span className="sidetext">Research</span>
            <span className="plus-icon"><IoMdAddCircleOutline /></span>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <FaUser />
              <span className="sidetext">Clients</span>
              <span className="plus-icon"><IoMdAddCircleOutline /></span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <BsCalendar2Fill />
              <span className="sidetext">Appointments</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <FaMessage />
              <span className="sidetext">Messages</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <GiPin />
              <span className="sidetext">Saved Topics</span>
            </div>
          </Link>
          <hr style={{ color: 'white', marginTop: "40px" }} />
          <div className="mid-text">What do you want to create?</div>
          <Link className={`text-decor side ${isActive('/handouts') ? 'active' : ''}`} to="/handouts">
            <div className="handout">
              <FaRegListAlt />
              <span className="handout-text">Handouts</span>
              <span className="plus-icon"><IoMdAddCircleOutline /></span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <RiMedicineBottleFill />
              <span className="sidetext">Supplenet Order</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <BiInjection />
              <span className="sidetext">Order Test</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <FaUserDoctor />
              <span className="sidetext">Doctor Referral</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <i className="fa-sharp fa-solid fa-people-arrows"></i>
              <span className="sidetext">Collaboration Letter</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <PiPersonSimpleWalk />
              <span className="sidetext">Service Referral</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <BiListPlus />
              <span className="sidetext">Shopping List</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <i className="fa-sharp fa-solid fa-store"></i>
              <span className="sidetext">Store List</span>
            </div>
          </Link>
          <Link className="text-decor" to="#">
            <div className="side">
              <IoBagOutline />
              <span className="sidetext">Vita's recommended <span className="prod">products</span></span>
            </div>
          </Link>
        </div>
        <div className="btn-group account-position">
          <Dropdown menu={{ items }} placement="bottomCenter" arrow={true}
            overlayStyle={{
              width: "150px",
              textAlign: "center",
              borderRadius: "20px",
            }}
            suffixIcon={null}
          >
            <Button className="account dropdown-toggle" type="button">
              My Account
              <svg style={{ marginLeft: "10px", marginBottom: "3px" }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
              </svg>
            </Button>
          </Dropdown>
        </div>
      </Sider>
    </>
   
  );
};
export default SideBar;