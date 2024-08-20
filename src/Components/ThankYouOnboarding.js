import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const ThankYouOnboarding = () => {
    const navigate = useNavigate();
    const [formData] = useState({});

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        navigate('/newsearch'); // Replace with the actual next page route
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h4>Thank you for completing the onboarding questionnaire! Your responses will help us personalize your VITA AI experience.</h4>
                        <Form onSubmit={handleSubmit}>

                            <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                    <div className='col-lg-4'></div>
                </div>
            </div>
        </div>
    );
};

export default ThankYouOnboarding;
