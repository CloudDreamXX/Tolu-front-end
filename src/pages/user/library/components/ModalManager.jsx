import React, { useState } from 'react';
import StepperModal from './StepperModal';

const ModalManager = ({ setModalOpen, setDropdownData,closeModal }) => {
    const [modalIndex, setModalIndex] = useState(0);
    const [dropdowns, setDropdowns] = useState(Array(7).fill(''));

    const handleAction = (data) => {
        setDropdownData(data);

        setModalOpen(false);
    };

    return (
        <div>
            <StepperModal
                modalIndex={modalIndex}
                handleAction={handleAction}
                setModalIndex={setModalIndex}
                dropdowns={dropdowns}
                closeModal={closeModal}
                setDropdowns={setDropdowns}
            />
        </div>
    );
};

export default ModalManager;
