import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthConcerns = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        forWhom: '',
        clientName: '',
        healthConcerns: [],
        otherHealthConcern: '',
        duration: '',
        seeingProvider: '',
        satisfaction: '',
        workoff: '',
        traumas: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevState) => {
                const newHealthConcerns = checked
                    ? [...prevState.healthConcerns, value]
                    : prevState.healthConcerns.filter((concern) => concern !== value);
                return { ...prevState, healthConcerns: newHealthConcerns };
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        // Navigate to the next page or dashboard
        navigate('/LifestyleDetails'); //
    };

    return (
        <div className='container-fluid bg-white'>
            <div className='signup-body'>
                <div className='row'>
                    <div className='col-lg-4'></div>
                    <div className='col-lg-4 signup-box'>
                        <h1 className="heading">Health Concerns</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Are you here for you or your client/patient?</label>
                                <div>
                                    <input
                                        type="radio"
                                        id="me"
                                        name="forWhom"
                                        value="Me"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="me">Me</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="client"
                                        name="forWhom"
                                        value="Client"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="client">Client/Patient</label>
                                </div>
                            </div>

                            {formData.forWhom === 'Client' && (
                                <div className="form-group">
                                    <label htmlFor="clientName">Enter Client/Patient Name:</label>
                                    <input
                                        type="text"
                                        id="clientName"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>
                                    What are {formData.forWhom === 'Me' ? 'your' : `${formData.clientName}'s`} primary health concerns? (Select all that apply)
                                </label>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="chronicPain"
                                        name="healthConcerns"
                                        value="Chronic Pain"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="chronicPain">Chronic Pain</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="digestiveIssues"
                                        name="healthConcerns"
                                        value="Digestive Issues"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="digestiveIssues">Digestive Issues</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="hormonalImbalance"
                                        name="healthConcerns"
                                        value="Hormonal Imbalance"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="hormonalImbalance">Hormonal Imbalance</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="mentalHealth"
                                        name="healthConcerns"
                                        value="Mental Health"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="mentalHealth">Mental Health</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="weightManagement"
                                        name="healthConcerns"
                                        value="Weight Management"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="weightManagement">Weight Management</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="allergies"
                                        name="healthConcerns"
                                        value="Allergies"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="allergies">Allergies</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="autoimmuneDisorders"
                                        name="healthConcerns"
                                        value="Autoimmune Disorders"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="autoimmuneDisorders">Autoimmune Disorders</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="other"
                                        name="healthConcerns"
                                        value="Other"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="other">Other (Please specify):</label>
                                    {formData.healthConcerns.includes('Other') && (
                                        <input
                                            type="text"
                                            name="otherHealthConcern"
                                            value={formData.otherHealthConcern}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>How long have {formData.forWhom === 'Me' ? 'you' : `${formData.clientName}`} been experiencing these health concerns?</label>
                                <div>
                                    <input
                                        type="radio"
                                        id="lessThan6Months"
                                        name="duration"
                                        value="Less than 6 months"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="lessThan6Months">Less than 6 months</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="6MonthsTo1Year"
                                        name="duration"
                                        value="6 months to 1 year"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="6MonthsTo1Year">6 months to 1 year</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="1To2Years"
                                        name="duration"
                                        value="1 to 2 years"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="1To2Years">1 to 2 years</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="over2Years"
                                        name="duration"
                                        value="Over 2 years"
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="over2Years">Over 2 years</label>
                                </div>
                            </div>
                            {formData.forWhom === 'Me' && (
                                <>
                                    <div className="form-group">
                                        <label>Are you seeing a healthcare provider or health coach?</label>
                                        <div>
                                            <input
                                                type="radio"
                                                id="yes"
                                                name="seeingProvider"
                                                value="Yes"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="yes">Yes</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="no"
                                                name="seeingProvider"
                                                value="No"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="no">No</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="noAnswer"
                                                name="seeingProvider"
                                                value="I don't want to answer to this question"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="noAnswer">I don't want to answer to this question</label>
                                        </div>
                                    </div>
                                    {formData.seeingProvider === 'Yes' &&
                                    <div className="form-group">
                                        <label>How satisfied are you with your current healthcare provider?</label>
                                        <div>
                                            <input
                                                type="radio"
                                                id="delighted"
                                                name="satisfaction"
                                                value="I'm delighted with my healthcare provider"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="delighted">I'm delighted with my healthcare provider</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="ok"
                                                name="satisfaction"
                                                value="It's ok, but I'm not getting results"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="ok">It's ok, but I'm not getting results</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="changed"
                                                name="satisfaction"
                                                value="I've changed my healthcare provider several times in the past couple of years."
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="changed">I've changed my healthcare provider several times in the past couple of years.</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="needHelp"
                                                name="satisfaction"
                                                value="I NEED help now"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="needHelp">I NEED help now</label>
                                        </div>
                                    </div>
                                    }
                                    <div className="form-group">
                                        <label>How much time have you had to take off from work or school in the last year?</label>
                                        <div>
                                            <input
                                                type="radio"
                                                id="workoff"
                                                name="workoff"
                                                value="0-2 days"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="workoff">0-2 days</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="workoffmore"
                                                name="workoff"
                                                value="3-14 days"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="workoffmore">3-14 days</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="workofflong"
                                                name="workoff"
                                                value="More than 15 days"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="workofflong">More than 15 days</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="doesntapply"
                                                name="workoff"
                                                value="Doesn't apply"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="doesntapply">Doesn't apply</label>
                                        </div>
                                        </div>
                                        <div className="form-group">
                                        <label>Have you experienced one or more of these stressful life events or traumas in your life?</label>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="familydeath"
                                                name="traumas"
                                                value="Death of a family member, romantic partner or very close friend Death of a family member, romantic partner or very close friend because of accident, homicide, or suicide"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Death of a family member, romantic partner or very close friend Death of a family member, romantic partner or very close friend because of accident, homicide, or suicide</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="abuse"
                                                name="traumas"
                                                value="Sexual or physical abuse by a family member, romantic partner, stranger, or someone else"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Sexual or physical abuse by a family member, romantic partner, stranger, or someone else</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="neglect"
                                                name="traumas"
                                                value="Emotional neglect or abuse such as ridicule, bullying, put-downs, being ignored or told you were no good by a family member or a romantic partner"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Emotional neglect or abuse such as ridicule, bullying, put-downs, being ignored or told you were no good by a family member or a romantic partner</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="discrimination"
                                                name="traumas"
                                                value="Discrimination"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Discrimination</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="threatening-situation"
                                                name="traumas"
                                                value="Life-threatening accident or situation (military combat or lived in a war zone)"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Life-threatening accident or situation (military combat or lived in a war zone)</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="threatening-illness"
                                                name="traumas"
                                                value="Life-threatening illness"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Life-threatening illness</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="robbery"
                                                name="traumas"
                                                value="Physical force or weapon threatened or used against you in a robbery or mugging"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Physical force or weapon threatened or used against you in a robbery or mugging</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="witness"
                                                name="traumas"
                                                value="Witness the murder, severe injury or assault of another person"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="traumas">Witness the murder, severe injury or assault of another person</label>
                                        </div>
                                        </div>
                                </>
                            )}
                            <div className="d-flex justify-content-center signin-button">
                                <button type="submit" className="btn btn-secondary">Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthConcerns;
