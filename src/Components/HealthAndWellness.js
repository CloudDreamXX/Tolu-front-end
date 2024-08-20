import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const HealthAndWellness = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        healthProductComparisons: false,
        factCheckingHealthInformation: false,
        alternativeSolutionsToMedicine: false,
        copingSkillsForChronicSymptoms: false,
        generalHealthQuestions: false,
        lifestyleTips: false,
        nutritionAdvice: false,
        labTestInformation: false,
        supplementsAndMedications: false,
        workoutsAndExercises: false,
        recipesAndDietPlans: false,
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
        navigate('/HealthPatternTracking'); // Replace with the actual next page route
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h2>Section 5: Health and Wellness Questions</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>What type of information are you looking to find on VITA AI? (Select all that apply)</Form.Label>
                            </Form.Group>
                            <Form.Group controlId="healthProductComparisons">
                                <Form.Check
                                    type="checkbox"
                                    label="Health Product Comparisons"
                                    name="healthProductComparisons"
                                    checked={formData.healthProductComparisons}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="factCheckingHealthInformation">
                                <Form.Check
                                    type="checkbox"
                                    label="Fact-Checking Health Information"
                                    name="factCheckingHealthInformation"
                                    checked={formData.factCheckingHealthInformation}
                                    onChange={handleChange}

                                />
                            </Form.Group>

                            <Form.Group controlId="alternativeSolutionsToMedicine">
                                <Form.Check
                                    type="checkbox"
                                    label="Alternative Solutions to Medicine"
                                    name="alternativeSolutionsToMedicine"
                                    checked={formData.alternativeSolutionsToMedicine}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="copingSkillsForChronicSymptoms">
                                <Form.Check
                                    type="checkbox"
                                    label="Coping Skills for Chronic Symptoms"
                                    name="copingSkillsForChronicSymptoms"
                                    checked={formData.copingSkillsForChronicSymptoms}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="generalHealthQuestions">
                                <Form.Check
                                    type="checkbox"
                                    label="General Health Questions"
                                    name="generalHealthQuestions"
                                    checked={formData.generalHealthQuestions}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="lifestyleTips">
                                <Form.Check
                                    type="checkbox"
                                    label="Lifestyle Tips"
                                    name="lifestyleTips"
                                    checked={formData.lifestyleTips}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="nutritionAdvice">
                                <Form.Check
                                    type="checkbox"
                                    label="Nutrition Advice"
                                    name="nutritionAdvice"
                                    checked={formData.nutritionAdvice}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="labTestInformation">
                                <Form.Check
                                    type="checkbox"
                                    label="Lab Test Information"
                                    name="labTestInformation"
                                    checked={formData.labTestInformation}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="supplementsAndMedications">
                                <Form.Check
                                    type="checkbox"
                                    label="Supplements and Medications"
                                    name="supplementsAndMedications"
                                    checked={formData.supplementsAndMedications}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="workoutsAndExercises">
                                <Form.Check
                                    type="checkbox"
                                    label="Workouts and Exercises"
                                    name="workoutsAndExercises"
                                    checked={formData.workoutsAndExercises}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="recipesAndDietPlans">
                                <Form.Check
                                    type="checkbox"
                                    label="Recipes and Diet Plans"
                                    name="recipesAndDietPlans"
                                    checked={formData.recipesAndDietPlans}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="other">
                                <Form.Label>Other (Please specify):</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="other"
                                    value={formData.other}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
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

export default HealthAndWellness;
