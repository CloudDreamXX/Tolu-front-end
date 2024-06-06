import React, {useEffect, useState} from 'react';
import Pills from "./Pills";
import {Info} from "./Info";

export const Priority = ({setPersonalInfo, setTriggerNext}) => {
    const [other, setOther] = useState(false);
    const [pills_text, setPillsText] = useState([
        "Client education", "Lab test ordering", "Communicating with doctors",
        "Meal Planning", "creating handouts", "Brain storming with other domain experts",
        "Symptoms/lifestyle/food/herb/test... lookup", "Research"
    ]);
    const [val, setVal] = useState('');
    const [priority, setPriority] = useState([]);
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
          const newPills = e.target.value.split(',').map(pill => pill.trim());
          const lowercasePillsText = pills_text.map(pill => pill.toLowerCase());

          const uniqueNewPills = newPills.filter(pill => !lowercasePillsText.includes(pill.toLowerCase()));

          if (uniqueNewPills.length > 0) {
            setPillsText((prevState) => [...prevState, ...uniqueNewPills]);
            setPriority((prev) => [...prev, ...uniqueNewPills]);
          }
          setVal('');
          setOther(false);
        }
    }
    const handleClick = (pill) => {
        setPriority((prev) => {
      if (prev.includes(pill)) {
        return prev.filter((item) => item !== pill);
      } else {
        return [...prev, pill];
      }
    });
    }
    const handleNextClick =() => {
          if (priority.length > 0) {

           setPersonalInfo(prevInfo => ({
                ...prevInfo,
                priority: priority,
            }));
           setTriggerNext(true);
      }
    }

    return (
        <>
            <div className="account_detail">
               <div className="account_box" style={{maxWidth: "800px",width: "100%", padding: "20px"}}>
                   <div className="account_heading" style={{display: "flex", flexDirection: "column"}}>
                       <h1 className="welcome-heading" style={{fontWeight: 600}}>What are you needs managing your clients in the order of priority?</h1>
                       <h2 className="welcome-signin" style={{marginBottom: "40px"}}> Select as many as you need</h2>
                       <div className="pill-container">
                           {pills_text.map((pill, index) => {
                                let random=(index%6)+1;
                                let class_name="col"+random.toString();
                                let style = {width: "fit-content", height: "50px", }
                                return <Pills
                                    key={index}
                                    text={pill}
                                    class_name={class_name}
                                    style={style}
                                    click={true}
                                    isActive={priority.includes(pill)}
                                    onClick={() => handleClick(pill)}
                                />
                           })
                           }

                       </div>
                       {!other && <div className="pills other" onClick={() => setOther(true)}>
                           Other
                       </div>}
                       {other && <input
                           type="text"
                           className="pill_input"
                           placeholder="Seperated by comma"
                           value={val}
                           onChange={(e) => setVal(e.target.value)}
                           onKeyDown={(e) => {
                             handleKeyPress(e)
                           }}
                       />}

                   </div>
                   <button
                            className="next_btn"
                            style={{ backgroundColor: priority.length > 0 ? 'black' : '#c0bfbf' }}
                            onClick={handleNextClick}
                        >Next</button>
               </div>

            </div>

        </>
    );
}

