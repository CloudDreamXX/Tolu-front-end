import React, { useState } from 'react';
import Button from '../../../../components/small/Button';
import Dropdown from '../../../../components/small/Dropdown';

const StepperModal = ({ handleAction, closeModal }) => {
    const [selectedModal1, setSelectedModal1] = useState(Array(7).fill(null));
    const [selectedModal2, setSelectedModal2] = useState(Array(7).fill(null));
    const [selectedModal3, setSelectedModal3] = useState([null]);

    const [modalIndex, setModalIndex] = useState(0);

    const symptomCategories = [
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
        { name: 'Flu Symptoms', options: ['Fever', 'Cough', 'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Fatigue'] },
        { name: 'Food Poisoning Symptoms', options: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever', 'Dehydration', 'Dizziness'] },
    ];


    const handleDropdownChange = (categoryIndex, value, modalType) => {
        if (modalType === 1) {
            const newSelections = [...selectedModal1];
            newSelections[categoryIndex] = value;
            setSelectedModal1(newSelections);
        } else if (modalType === 2) {
            const newSelections = [...selectedModal2];
            newSelections[categoryIndex] = value;
            setSelectedModal2(newSelections);
        } else if (modalType === 3) {
            const newSelections = [...selectedModal3];
            newSelections[categoryIndex] = value;
            setSelectedModal3(newSelections);
        }
    };

    // Reset states for the next step
    const resetStepValues = (step) => {
        if (step === 1) {
            setSelectedModal2(Array(7).fill(null)); // Reset second modal
            setSelectedModal3([null]); // Reset third modal
        }
        if (step === 2) {
            setSelectedModal3([null]); // Reset third modal
        }
    };

    const handleButtonClick = (action) => {
        if (action === 'next') {
            if (modalIndex === 0) {
                resetStepValues(1); // Reset the values before moving to next step
            } else if (modalIndex === 1) {
                resetStepValues(2); // Reset the values before moving to next step
            }
            setModalIndex(modalIndex + 1);
        } else if (action === 'previous') {
            setModalIndex(modalIndex - 1);
        } else if (action === 'continue') {
            // Final submit
            const allSelected = [
                ...selectedModal1,
                ...selectedModal2,
                ...selectedModal3
            ];
            console.log("All selected", allSelected);
            handleAction(allSelected)
            closeModal()
        } else if (action === 'skip') {
            closeModal();
        }
    };

    const renderDropdowns = (modalType) => {
        const data = modalType === 1 ? symptomCategories.slice(0, 7) : modalType === 2 ? symptomCategories.slice(7, 14) : symptomCategories.slice(14, 15);

        return data.map((category, index) => {
            const selectedValue = modalType === 1 ? selectedModal1[index] : modalType === 2 ? selectedModal2[index] : selectedModal3[index];
            return (
                <div key={index} className="mb-4 w-60">
                    <Dropdown
                        mainClassName="!rounded-full "
                        defaultText={category.name}
                        options={category.options.map(option => ({ value: option, label: option }))}
                        value={selectedValue || ''}
                        onChange={(e) => handleDropdownChange(index, e.value, modalType)}
                        onSelect={(e) => handleDropdownChange(index, e.value, modalType)}
                    />
                </div>
            );
        });
    };

    const modalContent = () => {
        if (modalIndex === 0) {
            return (
                <>
                    <section className='flex flex-col items-center'>
                        <h3 className="text-2xl text-[#252525B2] font-bold mb-8">Select your symptoms</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                            {renderDropdowns(1)}
                        </div>
                        <section className="flex w-full gap-4 justify-end" >
                            <Button className={"!bg-[#8E8E8E]  text-white "} onClick={() => handleButtonClick('skip')}>Skip</Button>
                            <Button className={"!bg-[#B6B6B6] text-[#1D1D1F99] "} onClick={() => handleButtonClick('next')}>Next</Button>
                        </section>
                    </section>
                </>
            );
        }
        if (modalIndex === 1) {
            return (
                <>
                    <section className='flex flex-col items-center'>

                        <h3 className="text-2xl text-[#252525B2] font-bold mb-8">Select your diagnosed conditions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                            {renderDropdowns(2)}
                        </div>
                        <section className="flex w-full gap-4 justify-end" >
                            <Button className={"!bg-[#8E8E8E]  text-white "} onClick={() => handleButtonClick('previous')}>Previous</Button>
                            <Button className={"!bg-[#B6B6B6] text-[#1D1D1F99] "} onClick={() => handleButtonClick('next')}>Next</Button>
                        </section>
                    </section>
                </>
            );
        }
        if (modalIndex === 2) {
            return (
                <>
                    <section className='flex flex-col items-center'>
                        <h3 className="text-2xl text-[#252525B2] font-bold mb-8">Select your allergies</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                            {renderDropdowns(3)}
                        </div>
                        <section className="flex w-full gap-4 justify-end" >
                            <Button className={"!bg-[#8E8E8E] text-white "} onClick={() => handleButtonClick('previous')}>Previous</Button>
                            <Button className={"!bg-[#B6B6B6] text-[#1D1D1F99] "} onClick={() => handleButtonClick('continue')}>Continue</Button>
                        </section>
                    </section>

                </>
            );
        }
    };

    return (
        <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-60">
                {modalContent()}
            </div>
        </div>
    );
};

export default StepperModal;
