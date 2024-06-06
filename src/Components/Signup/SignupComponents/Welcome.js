import React, {useEffect, useState} from 'react';
import Pills from "./Pills";

import "../Signup.css";
import {BiLogoGoogle, BiText} from "react-icons/bi";
import {IoMail} from "react-icons/io5";
import {FaApple} from "react-icons/fa6";
import {ImCross} from "react-icons/im"
import {Link, useNavigate} from "react-router-dom";

export const Welcome = ({handleNext}) => {
    const navigete = useNavigate()
    const pills_text = [
        {
            "icon": <BiLogoGoogle size={30}/>,
            "text": "Continue with Google",
        },
        {
            "icon": <FaApple size={30}/>,
            "text": "Continue with Apple"
        },
        {
            "icon": <BiText size={30}/>,
            "text": "Continue with Text"
        },
        {
            "icon": <IoMail size={30}/>,
            "text": "Continue with Email"
        }
    ]

    const handleCancel = () => {
        navigete("/")
    }
    return (
        <>
            <div className='welcome-body'>
          <div className='welcome-box'>
              <div className="cross_icon"><ImCross onClick={handleCancel}/></div>
              <div className="welcome">

              <h1 className="welcome-heading">WELCOME TO VITA GUIDE AI</h1>
                  <h2 className="welcome-signin"><button className='sign_link' onClick={() => navigete('/auth')}>Sign in </button>
                 or<button className="welcome_link welcome-signin" onClick={handleNext}>
                    Create a new account
                </button><
            /h2>
            {pills_text.map((pill, index) => {
                let random=(index%6)+1;
                let class_name="col"+random.toString();
                let style = {width: "350px", height: "50px"}
                return <Pills key={index} text={pill.text} class_name={class_name} icon={pill.icon} style={style}/>
            })
            }
          </div>
              </div>
          </div>
        </>
    );
};
