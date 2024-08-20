import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const HealthPattern = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        trackHealthPatterns: '',
        symptomOccurrence: false,
        conditionProgression: false,
        stressLevels: false,
        sleepPatterns: false,
        activityLevels: false,
        nutrition: false,
        other: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        navigate('/LearningQuiz'); // Navigate to the Learning Quiz page
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h2>Section 6: Health Pattern Tracking</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Would you like VITA AI to track your health patterns?</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="trackHealthPatterns"
                                    value="yes"
                                    checked={formData.trackHealthPatterns === 'yes'}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="trackHealthPatterns"
                                    value="no"
                                    checked={formData.trackHealthPatterns === 'no'}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {formData.trackHealthPatterns === 'yes' && (
                                <>
                                    <Form.Group>
                                        <Form.Label>Which aspects of your health would you like to track? (Select all that apply)</Form.Label>
                                    </Form.Group>
                                    <div>
                                        <Form.Group controlId="symptomOccurrence">
                                            <Form.Check
                                                type="checkbox"
                                                label="Symptom Occurrence"
                                                name="symptomOccurrence"
                                                checked={formData.symptomOccurrence}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="conditionProgression">
                                            <Form.Check
                                                type="checkbox"
                                                label="Condition Progression"
                                                name="conditionProgression"
                                                checked={formData.conditionProgression}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="stressLevels">
                                            <Form.Check
                                                type="checkbox"
                                                label="Stress Levels"
                                                name="stressLevels"
                                                checked={formData.stressLevels}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="sleepPatterns">
                                            <Form.Check
                                                type="checkbox"
                                                label="Sleep Patterns"
                                                name="sleepPatterns"
                                                checked={formData.sleepPatterns}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="activityLevels">
                                            <Form.Check
                                                type="checkbox"
                                                label="Activity Levels"
                                                name="activityLevels"
                                                checked={formData.activityLevels}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="nutrition">
                                            <Form.Check
                                                type="checkbox"
                                                label="Nutrition"
                                                name="nutrition"
                                                checked={formData.nutrition}
                                                onChange={handleChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                        </Form.Group>
                                    </div>

                                    <Form.Group controlId="other" style={{ marginTop: '20px' }}>
                                        <Form.Label>Other (Please specify):</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="other"
                                            value={formData.other}
                                            onChange={handleChange}
                                            style={{ width: '100%', height: '50px', border: '2px solid #000' }}
                                        />
                                    </Form.Group>
                                </>
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

export default HealthPattern;
