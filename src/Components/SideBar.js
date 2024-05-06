import React, { useState } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsCalendar2Fill } from "react-icons/bs";
import { BiSolidMessageAdd } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { GiPin } from "react-icons/gi";
import { FaMessage } from "react-icons/fa6";
import { FaRegListAlt } from "react-icons/fa";
import { RiMedicineBottleFill } from "react-icons/ri";
import { BiInjection } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { PiPersonSimpleWalk } from "react-icons/pi";
import { BiListPlus } from "react-icons/bi";
import { IoBagOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";


const { Sider } = Layout;

const SideBar = () => {
  let collapse = useSelector((state) => state.collapse.value);
  console.log(" collapse iniiamsnfk : ",collapse)

  return (

    <>
      <Sider width={260} hidden={!collapse}
         breakpoint="lg"
         collapsedWidth="200"
      className="box1" >
     <div className="mt-5">
         <Link className="text-decor" to="#">
          <div className="side ">
          <BiSolidMessageAdd /> 
           <span className="sidetext">New Search</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <FaUser /> 
           <span className="sidetext ">New Clients</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <BsCalendar2Fill />
           <span className="sidetext ">Appointments</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <FaMessage />
           <span className="sidetext ">Messages</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <GiPin  /> 
           <span className="sidetext ">Saved Topics</span>
           </div>
          </Link>

          <div className="mid-text">What do you want to create? </div>
          <Link className="text-decor" to="#">
          <div className="handout ">
          <FaRegListAlt />
           <span className="handout-text">Handouts</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <RiMedicineBottleFill />
           <span className="sidetext ">Supplenet Order</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <BiInjection /> 
           <span className="sidetext ">Order Test</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <FaUserDoctor />
           <span className="sidetext ">Doctor Referral</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <i class="fa-sharp fa-solid fa-people-arrows"></i>
           <span className="sidetext ">Collaboration Letter</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <PiPersonSimpleWalk />
           <span className="sidetext ">Service Referral</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <BiListPlus />
           <span className="sidetext ">Shopping List</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <i class="fa-sharp fa-solid fa-store"></i>
           <span className="sidetext ">Store List</span>
           </div>
          </Link>
          <Link className="text-decor" to="#">
          <div className="side ">
          <IoBagOutline />
           <span className="sidetext ">Vita's recommended <span className="prod">products</span></span>
           </div>
          </Link>
          </div>
          <div class="btn-group account-position ">
              <button type="button" class="account dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"> My Account <FaUserCircle /> </button>
            <ul class="dropdown-menu">
              <li><Link class="dropdown-item" href="#">Edit Profile</Link></li>
              <li><Link class="dropdown-item" href="#">Logout</Link></li>
            </ul>
          </div>
     </Sider>
    </>
   
  );
};
export default SideBar;
