import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CgFileAdd } from 'react-icons/cg';
import { PiChatsCircle } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/modals/Modal';
import Button from '../../../components/small/Button';
import { useAiLearningSearchMutation } from '../../../redux/apis/apiSlice';
import { setSidebarData } from '../../../redux/slice/sidebarSlice';
import QuestionAnswer from '../../screens/chat/components/QuestionAnswer';
import LibraryInput from '../../user/library/components/LibraryInput';
import FileCard from './components/FileCard';
import InfoCard from './components/InfoCard';

function AddBlog() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
    const [newFolder, setNewFolder] = useState('');
    const [aiLearningSearch] = useAiLearningSearchMutation();
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

    const [chats, setChats] = useState([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const [selectedFile, setSelectedFile] = useState(null);
    const lastItemRef = useRef(null);

    const handleInstructionChange = (e) => {
        setInstruction(e.target.value);
    };

    // console.log("chats", chats)
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

    const handleSubmitValue = async (text) => {
        if (!text.trim()) {
            toast.error("Please enter a message before submitting.");
            return;
        }

        if (selectedFile && !["application/pdf", "image"].some(type => selectedFile.type.startsWith(type))) {
            toast.error("Invalid file type. Only PDFs and images are allowed.");
            return;
        }

        const newChat = { question: text, detailed_answer: "", summary: "Streaming...", source: "Streaming...", audio: null };
        setChats((prevChats) => [...prevChats, newChat]);
        setIsLoading(true);

        try {
            await aiLearningSearch({
                chat_message: { user_prompt: text, is_new: true, regenerate_id: null, instructions: "Write random responses." },
                file: selectedFile || null,
                onMessage: (streamingText) => {
                    setChats((prevChats) => {
                        const updatedChats = [...prevChats];
                        updatedChats[updatedChats.length - 1].detailed_answer = streamingText;
                        return updatedChats;
                    });
                },
            });
        } catch (error) {
            console.error("Error sending request:", error);
            toast.error("Failed to fetch response.");
        } finally {
            setIsLoading(false);
        }
    };

    const containsHtml = /<\/?[a-z][\s\S]*>/i.test(chats.detailed_answer);



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
                {chats.length > 0 && (

                    <section className='w-full max-h-[400px] mt-4 custom-scroll overflow-auto'>

                        {chats.map((chat, i) => (
                            <QuestionAnswer key={i} chat={chat} lastItemRef={i === chats.length - 1 ? lastItemRef : null} />
                        ))}
                    </section>
                )}
                {/* {chats.length > 0 && (
                    <section className='bg-red-100 w-full m-4 rounded-lg p-4'>
                        {chats.length > 0 && (
                            <section className='bg-red-100 w-full m-4 rounded-lg p-4'>
                                {chats.map((message, index) => {
                                    const hasHtml = /<\/?[a-z][\s\S]*>/i.test(message.detailed_answer);
                                    return (
                                        <div key={index} className="mb-4">
                                            <p className="font-bold">Question:</p>
                                            <p>{message.question}</p>

                                            <p className="font-bold mt-2">Reply:</p>
                                            {hasHtml ? (
                                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.detailed_answer) }} />
                                            ) : (
                                                <p>{message.detailed_answer}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </section>
                        )}

                    </section>
                )} */}
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
