import React, {useEffect, useState} from 'react';
import "../Signup.css";
import {Link, } from "react-router-dom";
import {BiLogoGoogle, BiText} from "react-icons/bi";
import {FaApple} from "react-icons/fa6";
import Pills from "./Pills";

export const AccountDetail = ({personalInfo, setPersonalInfo, setTriggerNext, err}) => {
    const [error, setError] = useState("");
    const [value, setValue] = useState(false);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleClick= (e) => {
      e.preventDefault()
      if (email !== "" && password !== ""){
       setPersonalInfo(prevInfo => ({
            ...prevInfo,
            email: email,
            password: password
        }));
        setTriggerNext(true);
      }
      else{
          setError("All field are required");
      }
    };
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
    ]
    useEffect(() => {
        if (email !== '' && password !== ''){
          setValue(true);
          setError("");
        }
        else {
            setValue(false);
        }
    }, [email, password]);



    return (
        <>
               <div className="account_detail">
                   <div className="account_box">
                       <div className="account_heading">
                           <h1 className="welcome-heading" style={{fontWeight: 600}}>How would you like to complete your account, {personalInfo.name}</h1>
                           {pills_text.map((pill, index) => {
                let random=(index%6)+1;
                let class_name="col"+random.toString();
                let style = {width: "390px", height: "50px"}
                return <Pills key={index} text={pill.text} class_name={class_name} icon={pill.icon} style={style}/>
            })
            }
            <div className="horizontal-line">
                <span className="line"></span>
                <span className="or">OR</span>
                <span className="line"></span>
            </div>

            <form >
            {error && <span className='error-text'>Error: {error}</span>}
              <div className="form-group">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-controls"
                  id="Text1"
                  placeholder="Email*"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-controls"
                  id="Email1"
                  placeholder="Password*"
                />
              </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {err && <span className='error-text' style={{marginTop: "10px", marginBottom: "-10px"}}>Error: {err}</span>}
               <button
                    className="next_btn"
                    style={{ backgroundColor: value ?'black': '#c0bfbf' }}
                    onClick={(e)=>handleClick(e)}
                >Create account</button>
                </div>
            </form>
          </div>
                                              </div>

        </div>


        </>
    );
};


