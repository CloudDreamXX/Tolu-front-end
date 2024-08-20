import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const RewardSystem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        participateInRewards: '',
        rewardTypes: [],
        personalityTest: '',
        otherReward: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRewardTypeChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => {
            const rewardTypes = checked
                ? [...prevState.rewardTypes, value]
                : prevState.rewardTypes.filter((type) => type !== value);
            return { ...prevState, rewardTypes };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        navigate('/ThankYouOnboarding');
    };


    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h2>Section 8: Reward System</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Are you interested in participating in a reward system?</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="participateInRewards"
                                    value="yes"
                                    checked={formData.participateInRewards === 'yes'}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="participateInRewards"
                                    value="no"
                                    checked={formData.participateInRewards === 'no'}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {formData.participateInRewards === 'yes' && (
                            <Form.Group>
                                <Form.Label>What type of rewards are you interested in? (Select all that apply)</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Discounts on Health Products"
                                    name="rewardTypes"
                                    value="discounts"
                                    checked={formData.rewardTypes.includes('discounts')}
                                    onChange={handleRewardTypeChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Free Health Coaching Sessions"
                                    name="rewardTypes"
                                    value="coaching"
                                    checked={formData.rewardTypes.includes('coaching')}
                                    onChange={handleRewardTypeChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Access to Exclusive Content"
                                    name="rewardTypes"
                                    value="content"
                                    checked={formData.rewardTypes.includes('content')}
                                    onChange={handleRewardTypeChange}
                                />
                                <Form.Group>
                                    <Form.Label>Other (please specify)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="otherReward"
                                        value={formData.otherReward}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Form.Group>
                        )}

                            <Form.Group>
                                <Form.Label>Would you like to take a personality test?</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="personalityTest"
                                    value="yes"
                                    checked={formData.personalityTest === 'yes'}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="personalityTest"
                                    value="no"
                                    checked={formData.personalityTest === 'no'}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

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

export default RewardSystem;
