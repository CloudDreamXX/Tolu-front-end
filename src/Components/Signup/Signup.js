import React, {useEffect, useState} from 'react';
import "./Signup.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import {Welcome} from "./SignupComponents/Welcome";
import SideBar from "../SideBar";
import {Layout} from "antd";
import {AccountType} from "./SignupComponents/AccountType";
import {Link, useNavigate} from "react-router-dom";
import {Info} from "./SignupComponents/Info";
import {PractitionerType} from "./SignupComponents/PractitionerType";
import {PersonInfo} from "./SignupComponents/PersonInfo";
import {AccountDetail} from "./SignupComponents/AccountDetail";
import {Priority} from "./SignupComponents/Priority";
import {useDispatch, useSelector} from "react-redux";
import {createUser, findUser, GetSession} from "../../ReduxToolKit/Slice/userSlice";
import Home from "../Home";
import {toast} from "react-toastify";


export const Signup = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [showError, setShowError] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({});
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { Content } = Layout;
  const [triggerNext, setTriggerNext] = useState(false);
  const error = useSelector((state) => state.user.error);
  useEffect(() => {
    error && toast.error(error?.Message);
    if (error){
      setShowError(true);
    }
  }, [error]);

  const handleNext = async () => {
    if (page === 5) {
      const existingUser = await dispatch(findUser({email: personalInfo.email})).unwrap()
      if (existingUser?.response?.success) {
        setErr("User already exist");
      } else {
        setPage(page + 1);
      }
    }
    else if (page === 6) {
          await dispatch(createUser({
            name: personalInfo.name,
            email: personalInfo.email,
            password: personalInfo.password,
            type: type,
            role: role,
            location: personalInfo.location,
            num_clients: personalInfo.numClients,
            dob: personalInfo.dob,
            priority: personalInfo.priority
          }));
      navigate("/newsearch", { state: { showInfo: true } }); // Pass showInfo as state

    } else {
        setPage(page + 1);
    }


  };
  useEffect(() => {
    if (triggerNext) {
      handleNext();
      setTriggerNext(false);
    }
  }, [triggerNext, personalInfo]);
  const handleErrorClose = () => {
    setShowError(false);
    navigate("/");
  };


return (
    <>
      <Modal visible={showError} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error?.Message || "An error occurred"}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleErrorClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {page === 1 && (
        <div className='container-fluid bg-white'>
          <Welcome
              handleNext={handleNext}
          />
        </div>
      )}
      { (page >=2 && page <=6) && (
        <Layout>
          <SideBar className="sidebar-disabled"/>
          <Content style={{ padding: '0 00px', height: "100vh" }}>
            <div className='container-fluid bg-white main-content' style={{ height: "100vh" }}>
              <div className='row' style={{ height: "100vh" }}>
                    <div className='col-lg-2' style={{ height: "100vh" }}>
                        <div className='signin'>
                        <div className='signin_margin_text' > Already have an account ? <Link className='signin_text' to="/auth"> Sign in</Link></div>
                        </div>
                    </div>
                    <div className='col-lg-6' style={{width: "70%", height: "100vh"}}>
                      {page === 2 && <AccountType
                        setRole={setRole}
                        role={role}
                        handleNext={handleNext}
                      />
                      }
                      {page === 3 && <PractitionerType
                        type={type}
                        setType={setType}
                        handleNext={handleNext}
                      />
                      }
                      {
                        page === 4 && <PersonInfo
                          personalInfo={personalInfo}
                          setPersonalInfo={setPersonalInfo}
                          handleNext={handleNext}
                      />
                      }
                      {
                        page === 5 && <AccountDetail
                          personalInfo={personalInfo}
                          setPersonalInfo={setPersonalInfo}
                          setTriggerNext={setTriggerNext}
                          err={err}
                      />
                      }
                      {
                        page === 6 && <Priority
                          personalInfo={personalInfo}
                          setPersonalInfo={setPersonalInfo}
                          setTriggerNext={setTriggerNext}
                      />
                      }

                    </div>
              </div>
            </div>
          </Content>
        </Layout>
      )}
        </>
  );
};
