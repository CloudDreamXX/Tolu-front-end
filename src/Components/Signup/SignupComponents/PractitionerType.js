import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {FaUserDoctor} from "react-icons/fa6";
import {professions} from "../../constants";
import Select from "react-dropdown-select";
import {LuSearch} from "react-icons/lu";
import {PersonInfo} from "./PersonInfo";
import TermsAndServices from "./TermsAndServices";
import styled from "styled-components";

const CustomDropdown = styled(Select)`
  .react-dropdown-select-item{
    width: 100%;
    text-align: start;
  }
  .react-dropdown-select-content span {
    font-size: smaller;
  }
  .react-dropdown-select-dropdown-handle{
    display: none !important;
  }
  .react-dropdown-select-dropdown{
    width: 390px !important;
    top: 50px !important;
    align-items: flex-start;
    border: 1px solid black !important;
    border-top: none !important;
    box-shadow: none !important;
    font-size: 17px !important;

}
  
`;

export const PractitionerType = ({type,setType, handleNext}) => {
    const [check, setChecked] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!check);
    };
    return (
        <>
            <div className="account_body">
                <div className="account_box">
                <FaUserDoctor size={50}/>
                <div className="account_heading">
                    <h1 className="welcome-heading"> Create a practitioner account</h1>
                    <h2 className="welcome-signin" style={{marginBottom: "40px"}}> what type of practice do you have</h2>
                    <span className='findsearchicon'><LuSearch size={21} /></span>
                   <CustomDropdown
                     className="dropdown"
                     dropdownHeight="150px"
                     placeholder="Search for your practice"
                     searchable={true}
                     labelField="label"
                     valueField="value"
                     options={professions}
                     closeOnClickInput={true}
                     onChange={(values) => {values.map((val) => setType(val.value))}}
                    />
                    <div className="agree">
                        <input
                                type="checkbox"
                                checked={check}
                                onChange={handleCheckboxChange}
                                style={{marginTop: "8px"}}
                                className="check_agree"

                        />
                        <label htmlFor="check">I agree to Vita Guide's <Link onClick={() => setIsModalVisible(true)} style={{color: "black"}}> Terms of Services </Link><Link onClick={() => setIsModalVisible(true)} style={{color: "black"}}>and Privacy Statement</Link></label>
                    </div>
                     <button
                        className="next_btn"
                        style={{ backgroundColor: check ? 'black' : '#c0bfbf' }}
                        onClick={() => type !== '' ? handleNext(): null}
                    >Next</button>
                </div>
            </div>


              </div>
            {
                isModalVisible && <TermsAndServices
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                    />
            }

        </>
    );
};

