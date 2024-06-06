import React, {useState} from 'react';
import "../Signup.css";


function Pills({text, class_name, icon, style, click, isActive, onClick}) {
    return (
        <div className={"pills " + class_name + (isActive ? " pill_active" : "")}
            style={style}
            onClick={click ? onClick : null}
        >
            {icon ? <div style={{marginRight: "10px"}}>{icon}</div> : null} {text}
        </div>
    );
}

export default Pills;
