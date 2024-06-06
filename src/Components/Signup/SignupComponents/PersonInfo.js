import React, {useState} from 'react';
import "../Signup.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Select from "react-dropdown-select";
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
  .react-dropdown-select-input{
    padding-top: 2px !important;
  }
  .react-dropdown-select-content{
    padding-top: 2px !important;
  }
  
`;

export const PersonInfo = ({personalInfo, setPersonalInfo, handleNext}) => {
    const [error, setError] = useState("");

  const [name, setName] = useState('');
    const [dob, setDOB] = useState('');
    const [location, setLocation] = useState('');
    const [numClients, setNumClients] = useState('');
  const handleClick = (event) => {
      event.preventDefault(); // Prevent form submission
      if (name !== "" && dob !== "" && location !== "" && numClients!== ""){
       setPersonalInfo({
            name: name,
            dob: dob,
            location: location,
            numClients: numClients
        });
       handleNext();
      }
      else{
          setError("All field are required");
      }
    };


  const option = [
      {value: "0-5", label: "0-5"},
      {value: "More than 5", label: "More than 5"},
      {value: "More than 50", label: "More than 50"}

  ]
  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd'); // Format date to 'YYYY-MM-DD'
    setDOB(formattedDate);
  };


    return (
        <>
               <div className="account_body">
                   <div className="account_box">
                       <div className="account_heading">
                           <h1 className="welcome-heading" style={{fontWeight: 600}}>What is your personal information?</h1>
            <form >
            {error && <span className='error-text'>Error: {error}</span>}
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-controls"
                  id="Text1"
                  placeholder="Full Name*"
                />
              </div>
              <div className="form-group">
                <DatePicker
                  selected={dob}
                  onChange={(date) => handleDateChange(date)}
                  maxDate={new Date(new Date().getFullYear() - 18, 11, 31)} // Restricts dates older than 18 years
                  className="form-controls"
                  id="Email1"
                  placeholderText="Date of Birth*"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-controls"
                  id="location"
                  placeholder="Practice location*"
                />
              </div>
              <div className="form-group">
                  <CustomDropdown
                     className="dropdown-client"
                     dropdownHeight="80px"
                     placeholder="Search for your practice"
                     searchable={true}
                     valueField="value"
                     labelField="label"
                      options={option}
                      closeOnClickInput={true}
                      onChange={(values) => {values.map((val) => setNumClients(val.value))}}
                    />
              </div>
               <button
                    className="next_btn"
                    style={{ backgroundColor: personalInfo!=={} ? 'black' : '#c0bfbf' }}
                    onClick={(e) => handleClick(e)}
                >Create account</button>
            </form>
          </div>
               </div>

        </div>

        </>
    );
};


