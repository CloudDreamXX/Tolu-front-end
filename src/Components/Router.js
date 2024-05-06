import React from "react";
import Navbar from "./Navbar";
import Error from "./Error";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Layout } from "antd";
import Footer from './Footer'
const { Content } = Layout;

let accessMode = localStorage.getItem("Role");

const Router = () => {
  const select = useSelector((st) => st.accessmode.value);

  useEffect(() => {
    accessMode = localStorage.getItem("Role");
  }, [select]);

  let collapse = useSelector((state) => state.collapse.value);
  console.log(" collapse : ",collapse)

  return (
      <>
      <BrowserRouter>
        <Layout className={collapse ? "cus-hide" : ""} style={{ background:"#FFFF" }}> 
       <Navbar/>
       <Layout>
       <SideBar  />
        <Routes>
     
            <Route path="/" element={<Home />}></Route>
        
          <Route path="*" element={<Error />}></Route>
          </Routes> 
          </Layout>
          </Layout>
      </BrowserRouter>

    </>
  );
};

export default Router;
