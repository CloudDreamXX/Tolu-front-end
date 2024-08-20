import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Login/Login.css";
import {useDispatch, useSelector} from "react-redux";
import { Onboard } from "../ReduxToolKit/Slice/userSlice";

const Onboarding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => {
        return state.user.loading;
      });
    // const error = useSelector((state) => state.user.error);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        Location: '',
        Job: '',
        marital: '',
        jobDescription: ''
    });
    const [isJobTextarea, setIsJobTextarea] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'age') {
            const age = parseInt(value, 10);
            if (age < 13 || isNaN(age)) {
                setFormData({
                    ...formData,
                    [name]: ''
                });
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'Job' && value === 'Textarea') {
            setIsJobTextarea(true);
        } else if (name === 'Job') {
            setIsJobTextarea(false);
        }
    };

    const handleJobDescriptionChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // dispatch(Onboard({ payload: formData, navigate: () => navigate('/health-concerns') }));
        navigate('/health-concerns');
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h1 className="heading">VITA GUIDE</h1>
                        <div style={{ display: "flex", flexDirection: "column", justifyItems: "center", textAlign: "center" }}>
                            <h1 className='heading' style={{ color: "#0f6efd", fontSize: "25px" }}>Welcome to Vita Guide AI</h1>
                            <p>We'd like to know a bit more about you to personalize your experience.</p>
                        </div>
                        <form onSubmit={handleSubmit} initialValues={{remember: true,}}>
                            <div className="form-group">
                                <label htmlFor="age">Age:</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    min="13"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender at birth:</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="genderafter">Choose gender after birth (if applicable):</label>
                                <input
                                    type="string"
                                    id="genderafter"
                                    name="genderafter"
                                    value={formData.genderafter}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Location">Location:</label>
                                <textarea
                                    id="Location"
                                    name="Location"
                                    value={formData.Location}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Job">Job:</label>
                                <select
                                    id="Job"
                                    name="Job"
                                    value={formData.Job}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select</option>
                                    <option value="Textarea">I have a Job</option>
                                    <option value="dont-want-to-share">I don't want to share</option>
                                </select>
                                {isJobTextarea && (
                                    <textarea
                                        id="jobDescription"
                                        name="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={handleJobDescriptionChange}
                                        required
                                        className="form-control mt-2"
                                        placeholder="Please describe your job"
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="marital">Marital Status:</label>
                                <select
                                    id="marital"
                                    name="marital"
                                    value={formData.marital}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select</option>
                                    <option value="Married">Married</option>
                                    <option value="Single">Single</option>
                                    <option value="Complicated">Complicated</option>
                                    <option value="dont-want-to-share">I don't want to share</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="children">Children:</label>
                                <select
                                    id="children"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select</option>
                                    <option value="dont-have">I don't have kids</option>
                                    <option value="step-parent">I'm a stepmother/father</option>
                                    <option value="have-child">I have a child</option>
                                    <option value="have-children">I have children</option>
                                    <option value="dont-want-to-share">I don't want to share</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-center signin-button">
                                <button type="submit" loading={loading} className="btn btn-secondary">Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
