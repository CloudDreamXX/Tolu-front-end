import React from "react";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { COLLAPSE } from "../ReduxToolKit/Slice/Collapse";
import { useDispatch } from "react-redux";
import { useState } from "react";

function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch=useDispatch();
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    dispatch(COLLAPSE(!collapsed));
  };
  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="navbar">
            <div className="nav-text">
           <button className="navbar-button" onClick={toggleCollapsed}><IoMdMenu size={30} /> </button> 
            <Link to="/" className="navbar-span">V I T A GUIDE </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
