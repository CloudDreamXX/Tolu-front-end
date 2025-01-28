import React, { useState, useEffect } from 'react';
import Modal from './Modal';  // Assuming Modal is in the same directory

const ModalManager = ({ setModalOpen, setDropdownData }) => {
    const [modalIndex, setModalIndex] = useState(0);
    const [dropdowns, setDropdowns] = useState(Array(7).fill(''));

    const handleAction = (data) => {
        // Set the dropdown data in the parent component
        setDropdownData(data);
        console.log('Final Dropdown Data:', data); // Data can also be sent to an API or stored

        // Close the modal manager
        setModalOpen(false);
    };

    return (
        <div>
            <Modal
                modalIndex={modalIndex}
                handleAction={handleAction}
                setModalIndex={setModalIndex}
                dropdowns={dropdowns}
                setDropdowns={setDropdowns}
            />
        </div>
    );
};

export default ModalManager;
