import React, { useState } from 'react';
import { ImCross } from "react-icons/im";
import Pills from "./Pills";
import { Button, Modal } from "antd";
import {TbVirusSearch} from "react-icons/tb";
import {FaStar} from "react-icons/fa";
import {BiSolidFirstAid, BiTestTube} from "react-icons/bi";
import {AiFillQuestionCircle} from "react-icons/ai";

export const Info = ({ showInfo, setShowInfo }) => {
  const [showNext, setShowNext] = useState(false);

  const pillsText = [
    { icon: <TbVirusSearch size={25} />, text: "Research" },
    { icon: <FaStar size={25} />, text: "Client Education" },
    { icon: <BiTestTube size={25} />, text: "Lab Test & Supplement Ordering" },
  ];

  const infoText = [
    { icon: <BiSolidFirstAid size={25} />, text: "Collaboration With Doctors" },
    { icon: <AiFillQuestionCircle size={25} />, text: "Brainstorming With Colleagues" },
    { icon: <BiTestTube size={25} />, text: "Client Management and Communication" },
  ];

  const handleCancel = () => {
    setShowInfo(false);
    setShowNext(false);
  };

  const handleNextClick = () => {
          setShowInfo(false);
      setShowNext(false);
  };
  const handleClick = () => {
        setShowNext(true);
    };

  return (
    <>
      <Modal visible={showInfo || showNext}  style={{backgroundColor: "white"}} onCancel={handleCancel} footer={null} centered width={800}>
          <div className="welcome">
           {showNext === false ? (
              <>
                <h2 style={{ marginBottom: "40px", marginTop: "30px" }} className="welcome-signin">More Client Retention and lead generation tools coming soon.</h2>
                {infoText.map((pill, index) => {
                let style = { width: "420px", height: "50px", backgroundColor: "white", border: "1px solid #79DBBD", marginBottom: "25px" };
                return <Pills key={index} text={pill.text} icon={pill.icon} style={style} />;
              })}
                  <button
                className="next_btn"
                style={{backgroundColor: "black"}}
                onClick={handleClick}
            >Next</button>

              </>
            ) : (
              <>
                <h2 style={{ marginBottom: "40px", marginTop: "30px" }} className="welcome-signin">We currently can help you with many aspects of client retention.</h2>
                  {pillsText.map((pill, index) => {
                  let style = { width: "370px", height: "50px", backgroundColor: "white", border: "1px solid #79DBBD", marginBottom: "25px" };
                  return <Pills key={index} text={pill.text} icon={pill.icon} style={style} />;
                })}
                   <button
                className="next_btn"
                style={{backgroundColor: "black"}}
                onClick={handleNextClick}
            >Next</button>
              </>
            )}
          </div>
      </Modal>
    </>
  );
};


