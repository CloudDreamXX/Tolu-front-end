import React, { useEffect, useState } from 'react';
import LibraryInput from '../../user/library/components/LibraryInput';
import { CgFileAdd } from 'react-icons/cg';
import FileCard from './components/FileCard';
import { PiChatsCircle } from 'react-icons/pi';
import InfoCard from './components/InfoCard';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarData } from '../../../redux/slice/sidebarSlice';
import Modal from '../../../components/modals/Modal';
import Button from '../../../components/small/Button';
import { useAiLearningSearchMutation } from '../../../redux/apis/apiSlice';
import toast from 'react-hot-toast';

function AddBlog() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
    const [newFolder, setNewFolder] = useState('');
    const [aiLearningSearch, { isLoading }] = useAiLearningSearchMutation();
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [instruction, setInstruction] = useState(null);
    const sidebarData = useSelector((state) => state.sidebar.data);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { dispatch(setSidebarData(false)); setIsModalOpen(false) };
    const openInstructionModal = () => setIsInstructionModalOpen(true);
    const closeInstructionModal = () => setIsInstructionModalOpen(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);


    const handleInstructionChange = (e) => {
        setInstruction(e.target.value);
    };

    const addInstruction = () => {
        console.log(instruction);
        closeInstructionModal();
    };

    const handleNewReply = (newReply, question) => {
        const newMessage = {
            question: question,  // Replace with actual question if needed
            reply: newReply,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    useEffect(() => {
        if (sidebarData) {
            openModal();
        }
    }, [sidebarData]);

    const handleFolderSubmit = () => {
        if (newFolder.trim()) {
            dispatch(setSidebarData({ ...sidebarData, folders: [...sidebarData.folders, newFolder] }));
            setNewFolder('');
            closeModal();
        }
    };

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('File selected:', file);
        toast.success(`File Uploaded: ${file.name}`);
    };
    const handleFileUpload = (file) => {
        console.log("Uploaded File:", file.name);
        // const file = event.target.files[0];
        setSelectedFile(file);
        toast.success(`File Uploaded: ${file.name}`);
    };
    const handleFileCardClick = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmitValue = async (value) => {
        try {
            const formData = new FormData();
            formData.append("chat_message", JSON.stringify({
                // user_prompt: "What's my name?",
                user_prompt: value,
                is_new: true,
                regenerate_id: null,
                instructions: instruction
            }));
            if (selectedFile) {
                const fileType = selectedFile.type;

                if (fileType === "application/pdf") {
                    console.log("Checking pdf", selectedFile)
                    formData.append("pdf", selectedFile);
                } else if (fileType.startsWith("image")) {
                    console.log("Checking image", selectedFile)
                    formData.append("image", selectedFile);
                } else {
                    console.log("Please select a valid PDF or image file.");
                    return;
                }
            }
            const response = await aiLearningSearch(formData);


            if (typeof response.error.data === "string") {

                try {
                    const cleanedData = response.error.data
                        .replace(/^data:\s*/, '')
                        .replace(/^\s*[\r\n]+/, '')
                        .replace(/[\r\n]+$/, '')
                        .trim();
                    const dataObjects = cleanedData.split(/\s*data:\s*/).filter(item => item.trim() !== '');
                    const parsedDataArray = dataObjects.map(item => {
                        try {
                            return JSON.parse(item);
                        } catch (e) {
                            console.error("Error parsing individual object:", e);
                            return null;
                        }
                    }).filter(item => item !== null);
                    const replies = parsedDataArray.map(item => item.reply).join(' ');
                    handleNewReply(replies, value)
                    setSelectedFile(null)
                    setInstruction(null)
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                    toast.error("Invalid JSON response");
                }
            } else {
                console.log("Unexpected response format:", response.error.data);
            }

        } catch (error) {
            console.error('Request failed:', error);
            toast.error("Request Failed");
        }
    };





    return (
        <>
            <Modal className={'w-[300px]'} isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Create New Folder</h1>}>
                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="mt-4 px-4 py-2 border rounded"
                />
                <section className='flex justify-end mt-8 gap-3'>
                    <Button
                        className={"!bg-[#8E8E8E]  text-white "}
                        text="Cancel"
                        onClick={closeModal}
                    />
                    <Button
                        className={"!bg-[#B6B6B6] text-[#1D1D1F99]  "}
                        text="Add Folder"
                        onClick={handleFolderSubmit}
                    />
                </section>
            </Modal>

            <Modal className="w-[800px]" isOpen={isInstructionModalOpen} onClose={closeInstructionModal} title={<h1 className="text-xl font-bold">Add instructions</h1>}>
                <textarea
                    className="w-full mt-4 h-40 p-4 border rounded"
                    placeholder="Enter instructions here..."
                    value={instruction}
                    onChange={handleInstructionChange}
                />
                <section className="flex justify-end gap-2 mt-4">
                    <Button
                        className={"!bg-[#8E8E8E] text-white "}
                        text="Close"
                        onClick={closeInstructionModal}
                    />
                    <Button
                        className={"!bg-[#B6B6B6] text-[#1D1D1F99] "}
                        text="Add Instructions"
                        onClick={addInstruction}
                    />
                </section>
            </Modal>

            {/* Main Content */}
            <div className="w-full xs:px-4 md:px-36 flex-col h-full flex justify-center items-center">
                <section className="w-full flex justify-between pl-4 mb-5 items-start">
                    <h1 className="text-3xl font-semibold">
                        Perimenopause and Menopause
                    </h1>
                </section>

                <LibraryInput
                    placeholder="Enter Prompt..."
                    onChangeValue={handleInputChange}
                    onSubmitValue={handleSubmitValue}
                    onFileUpload={handleFileUpload}
                    isLoading={isLoading}

                />
                {messages.length > 0 && (
                    <section className='bg-red-100 w-full m-4 rounded-lg p-4'>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <p><strong>Question:</strong> {message.question}</p>
                                <p><strong>Reply:</strong> {message.reply}</p>
                            </div>
                        ))}
                    </section>
                )}
                {/* File Cards */}
                <div className="flex  h-30 xs:flex-col sm:flex-col md:flex-row gap-4 mt-7  w-full">
                    <section className="w-full cursor-pointer">
                        <div onClick={handleFileCardClick}>
                            <FileCard
                                title="Add Files"
                                description="Chats in this project can access file content"
                                Icon={CgFileAdd}
                            />
                        </div>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
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
