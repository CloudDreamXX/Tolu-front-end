import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const LearningQuiz = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        participateInQuizzes: '',
        quizFrequency: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        navigate('/RewardSystem'); // Replace with the actual next page route
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h2>Section 7: Learning Quiz</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Are you interested in participating in quizzes to evaluate your knowledge of health?</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="participateInQuizzes"
                                    value="yes"
                                    checked={formData.participateInQuizzes === 'yes'}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="participateInQuizzes"
                                    value="no"
                                    checked={formData.participateInQuizzes === 'no'}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {formData.participateInQuizzes === 'yes' && (
                                <Form.Group>
                                    <Form.Label>How often would you like to receive these quizzes?</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="Daily"
                                        name="quizFrequency"
                                        value="daily"
                                        required
                                        checked={formData.quizFrequency === 'daily'}
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Weekly"
                                        name="quizFrequency"
                                        value="weekly"
                                        required
                                        checked={formData.quizFrequency === 'weekly'}
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Monthly"
                                        name="quizFrequency"
                                        value="monthly"
                                        required
                                        checked={formData.quizFrequency === 'monthly'}
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="As Needed"
                                        name="quizFrequency"
                                        value="asNeeded"
                                        required
                                        checked={formData.quizFrequency === 'asNeeded'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            )}

                            <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                                Next
                            </Button>
                        </Form>
                    </div>
                    <div className='col-lg-4'></div>
                </div>
            </div>
        </div>
    );
};

export default LearningQuiz;
