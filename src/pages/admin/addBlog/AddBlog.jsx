import React, { useEffect, useState } from 'react';
import LibraryInput from '../../user/library/components/LibraryInput';
import { CgFileAdd } from 'react-icons/cg';
import FileCard from './components/FileCard';
import { PiChatsCircle } from 'react-icons/pi';
import InfoCard from './components/InfoCard';
import { useDispatch, useSelector } from 'react-redux';
// import Modal from '../../user/library/components/Modal';
import { setSidebarData } from '../../../redux/slice/sidebarSlice';
import Modal from '../../../components/modals/Modal';

function AddBlog() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
    const [newFolder, setNewFolder] = useState('');
    const dispatch = useDispatch();

    const sidebarData = useSelector((state) => state.sidebar.data);
    console.log("Sidebar data:", sidebarData);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { dispatch(setSidebarData(false)); setIsModalOpen(false) };

    const openInstructionModal = () => setIsInstructionModalOpen(true);
    const closeInstructionModal = () => setIsInstructionModalOpen(false);



    useEffect(() => {
        if (sidebarData) {
            openModal();
        }
    }, [sidebarData]);

    const handleFolderSubmit = () => {
        // Handle form submission
        if (newFolder.trim()) {
            // Dispatch action to add the new folder to the sidebar data
            dispatch(setSidebarData({ ...sidebarData, folders: [...sidebarData.folders, newFolder] }));
            setNewFolder('');  // Clear input field
            closeModal();  // Close the modal after adding
        }
    };



    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (value) => {
        setInputValue(value);
    };



    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('File selected:', file);
        // You can call an API or handle file upload logic here
    };

    const handleFileCardClick = () => {
        document.getElementById('file-input').click(); // Trigger file input click
    };




    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Create New Folder</h1>}>
                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="mt-4 px-4 py-2 border rounded"
                />
                <section>

                    <button
                        onClick={handleFolderSubmit}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add
                    </button>
                    <button
                        onClick={closeModal}
                        className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Cancel
                    </button>
                </section>
            </Modal>
            <Modal isOpen={isInstructionModalOpen} onClose={closeInstructionModal} title={<h1 className="text-xl font-bold">Add instructions</h1>}>
                <textarea className="w-full mt-4 h-40 p-4 border rounded" placeholder="Enter instructions here..." />
                <section className='flex justify-end'>
                    <button
                        onClick={closeInstructionModal}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={closeInstructionModal}
                        className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Cancel
                    </button>
                </section>
            </Modal  >

            {/* Main Content */}
            <div className="w-full px-36 flex-col h-full flex justify-center items-center">
                <section className="w-full flex justify-between pl-4 mb-5 items-start">
                    <h1 className="text-3xl font-semibold">
                        Perimenopause and Menopause
                    </h1>
                </section>

                {/* Input Component */}
                {/* <LibraryInput placeholder="Ask anything..." /> */}
                <LibraryInput
                    placeholder="Enter text here"
                    onChangeValue={handleInputChange}  // Pass handler here
                />

                {/* File Cards */}
                <div className="flex  h-30 xs:flex-col sm:flex-col md:flex-row gap-4 mt-7  w-full">
                    <section className="w-full cursor-pointer">
                        <div onClick={handleFileCardClick}>
                            <FileCard
                                title="Add Files"
                                description="Chats in this project can access file content"
                                Icon={CgFileAdd} // Passing the icon component as a prop
                            />
                        </div>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Hide the default file input
                        />
                        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                    </section>
                    <section className='w-full cursor-pointer' onClick={openInstructionModal}>

                        <FileCard
                            title="Instructions"
                            description="Chats in this project can access file content"
                        />
                    </section>
                </div>

                {/* Info Cards Section */}
                <section className="w-full pl-4 mt-7 items-start justify-start">
                    <section className="w-full flex justify-between items-center">
                        <h2 className="text-base font-semibold text-center">
                            Chats in this project
                        </h2>
                    </section>
                    <section className="w-full mt-4 space-y-8 pt-6">
                        <InfoCard
                            Icon={PiChatsCircle}
                            title="Brain Fog Post-Hysterectomy"
                            description="The link between brain fog and hysterectomy"
                        />
                        <InfoCard
                            Icon={PiChatsCircle}
                            title="Brain Fog Post-Hysterectomy"
                            description="The link between brain fog and hysterectomy"
                        />
                        <InfoCard
                            Icon={PiChatsCircle}
                            title="Brain Fog Post-Hysterectomy"
                            description="The link between brain fog and hysterectomy"
                        />
                        <InfoCard
                            Icon={PiChatsCircle}
                            title="Brain Fog Post-Hysterectomy"
                            description="The link between brain fog and hysterectomy"
                        />
                        <InfoCard
                            Icon={PiChatsCircle}
                            title="Brain Fog Post-Hysterectomy"
                            description="The link between brain fog and hysterectomy"
                        />
                    </section>
                </section>
            </div>
        </>
    );
}

export default AddBlog;
