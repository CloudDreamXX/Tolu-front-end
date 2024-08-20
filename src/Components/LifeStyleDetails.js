import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const LifestyleDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        activityLevel: '',
        diet: '',
        otherDiet: '',
        useWearable: '',
        wearableDevices: ''
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
        navigate('/HealthAndWellness'); // Replace with the actual next page route
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h2>Section 4: Lifestyle Details</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="activityLevel">
                                <Form.Label>Describe your typical daily activity level:</Form.Label>
                                <Form.Control as="select" name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Sedentary">Sedentary</option>
                                    <option value="Lightly Active">Lightly Active</option>
                                    <option value="Moderately Active">Moderately Active</option>
                                    <option value="Very Active">Very Active</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="diet">
                                <Form.Label>How would you describe your current diet?</Form.Label>
                                <Form.Control as="select" name="diet" value={formData.diet} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Balanced">Balanced</option>
                                    <option value="Low Carb">Low Carb</option>
                                    <option value="High Protein">High Protein</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Gluten-Free">Gluten-Free</option>
                                    <option value="Other">Other (Please specify)</option>
                                </Form.Control>
                            </Form.Group>

                            {formData.diet === 'Other' && (
                                <Form.Group controlId="otherDiet">
                                    <Form.Label>Other Diet:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="otherDiet"
                                        value={formData.otherDiet}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            )}

                            <Form.Group controlId="useWearable">
                                <Form.Label>Do you use any wearable devices to track your health?</Form.Label>
                                <Form.Control as="select" name="useWearable" value={formData.useWearable} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Control>
                            </Form.Group>

                            {formData.useWearable === 'Yes' && (
                                <Form.Group controlId="wearableDevices">
                                    <Form.Label>If yes, which devices do you use?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="wearableDevices"
                                        value={formData.wearableDevices}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            )}

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

export default LifestyleDetails;
