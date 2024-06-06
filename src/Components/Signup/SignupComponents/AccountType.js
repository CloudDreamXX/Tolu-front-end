import React, {useEffect, useState} from 'react';
import {FaUserDoctor} from "react-icons/fa6";
import {RiUserHeartFill} from "react-icons/ri";

import Pills from "./Pills";

export const AccountType = ({setRole, role, handleNext}) => {
    const pills_text = [
        {
            "icon": <FaUserDoctor size={30}/>,
            "text": "Practitioner Account",
            "value": "practitioner"
        },
        {
            "icon": <RiUserHeartFill size={30}/>,
            "text": "Client Account",
            "value": "client"
        },
    ];

    return (
        <>
            <div className="account_body">
                <div className="account_box">
                <div className="account_heading">
                    <h1 className="welcome-heading"> Get started with Vita Guide AI</h1>
                    <h2 className="welcome-signin" style={{marginBottom: "40px"}}> which type of account would you like to create?</h2>
                    {pills_text.map((pill, index) => {
                        let random=(index%6)+1;
                        let class_name="col"+random.toString();
                        let style = {width: "475px", height: "50px", marginBottom: "25px !important", cursor: "pointer"}
                        return <Pills
                            key={index}
                            text={pill.text}
                            class_name={class_name}
                            icon={pill.icon}
                            style={style}
                            click={true}
                            isActive={role === pill.text}
                            onClick={() => setRole(pill.text)}
                        />
                    })
                    }
                    <button
                        className="next_btn"
                        style={{ backgroundColor: role !== "" ? 'black' : '#c0bfbf' }}
                        onClick={() => role !== '' ? handleNext() : null}
                    >Next</button>
                </div>
            </div>

            </div>

        </>
    );
};

