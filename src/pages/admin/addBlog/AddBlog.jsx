import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CgFileAdd } from 'react-icons/cg';
import { PiChatsCircle } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/modals/Modal';
import Button from '../../../components/small/Button';
import { useAddNewFolderMutation, useAiLearningSearchMutation, useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
// import { setAddFolderData } from '../../../redux/slice/sidebarSlice';
import QuestionAnswer from '../../screens/chat/components/QuestionAnswer';
import LibraryInput from '../../user/library/components/LibraryInput';
import FileCard from './components/FileCard';
import InfoCard from './components/InfoCard';
import { setAddFolderData } from '../../../redux/slice/sidebarSlice';
import DOMPurify from 'dompurify';
import DynamicContent from './components/DynamicContent';

function AddBlog() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
    const [addFolder, setAddNewFolder] = useState('');
    const [addFolderDescription, setAddFolderDescription] = useState('');
    const [messages, setMessages] = useState([]);
    const [instruction, setInstruction] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [chats, setChats] = useState([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addNewFolderState = useSelector((state) => state.sidebar.addFolder);
    const [addNewFolder, { isLoading: addNewFolderLoading }] = useAddNewFolderMutation();
    const [aiLearningSearch] = useAiLearningSearchMutation();
    const { data: allFolders } = useGetFolderStructureQuery();
    const dispatch = useDispatch();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        dispatch(setAddFolderData({ folderId: null, add: false })); // Assuming you want to set the selected folder ID here
        ; setIsModalOpen(false)
    };

    const openInstructionModal = () => setIsInstructionModalOpen(true);
    const closeInstructionModal = () => setIsInstructionModalOpen(false);

    const lastItemRef = useRef(null);

    const handleInstructionChange = (e) => {
        setInstruction(e.target.value);
    };


    function findFolderById(folders, id) {
        // Check if folders is valid and iterable
        if (!Array.isArray(folders)) return null;

        for (const folder of folders) {
            if (folder.id === id) {
                return folder; // Return the folder if the ID matches
            }
            // Check if subfolders is valid before recursion
            if (Array.isArray(folder.subfolders) && folder.subfolders.length > 0) {
                const result = findFolderById(folder.subfolders, id);
                if (result) return result; // Return if found in subfolders
            }
        }
        return null; // Return null if not found
    }

    // Ensure that `addNewFolderState.folderId` and `allFolders` are available before calling the function
    const folder = allFolders && addNewFolderState?.folderId
        ? findFolderById(allFolders.folders, addNewFolderState.folderId)
        : null;
    const content = folder?.content;
    console.log("folder", folder);
    const addInstruction = () => {
        console.log(instruction);
        closeInstructionModal();
    };



    const handleFolderSubmit = async () => {
        // Check if folder name and folder id are provided
        if (!addFolder.trim() || !addNewFolderState?.folderId) {
            toast.error("Both folder name and folder ID are required!"); // Show toast if either is missing
            return; // Exit the function early
        }

        try {
            const { data, error } = await addNewFolder({
                name: addFolder,
                description: addFolderDescription,
                parent_folder_id: addNewFolderState?.folderId,
            });

            if (error) {
                console.log("Error adding folder:", error);
                toast.error("Failed to add folder!"); // Show toast for failure
            } else {
                console.log("Folder added successfully", data?.message);
                toast.success(data?.message); // Show success toast
            }
        } catch (error) {
            console.error("API call failed:", error);
            toast.error("An error occurred while adding the folder!");
        }

        // Reset the form and close the modal
        setAddNewFolder('');
        setAddFolderDescription('');
        dispatch(setAddFolderData({ folderId: null, add: false }));
        closeModal();
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
                folder_id: addNewFolderState?.folderId || null,
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


    // const DynamicContent = ({ content }) => {
    //     // Sanitize the incoming HTML content using DOMPurify
    //     const sanitizedContent = DOMPurify.sanitize(content);

    //     return (
    //         <div
    //             // Render the sanitized content inside the div
    //             dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    //         />
    //     );
    // };
    useEffect(() => {
        if (addNewFolderState?.add) {
            openModal();
        }
    }, [addNewFolderState?.add]);

    const [topicModalOpen, setTopicModalOpen] = useState(false); // State for modal visibility
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item

    // Handle InfoCard click
    const handleCardClick = (item) => {
        setSelectedItem(item); // Set the selected item
        setTopicModalOpen(true); // Open the modal
    };





    return (
        <div className=''>
            <Modal className={''} isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Create New Folder</h1>}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Enter folder name"
                        value={addFolder}
                        onChange={(e) => setAddNewFolder(e.target.value)}
                        className="mt-4 px-4 py-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={addFolderDescription}
                        onChange={(e) => setAddFolderDescription(e.target.value)}
                        className="mt-4 px-4 py-2 border rounded"
                    />
                </div>

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
            <Modal
                className={'w-[500px] lg:w-[700px] max-h-[600px] custom-scroll  overflow-auto '}
                isOpen={topicModalOpen}
                onClose={() => setTopicModalOpen(false)}
                title={<h1 className="text-xl font-bold">Topic Details</h1>}
            >
                <section className="mt-4 overflow-auto">
                    {selectedItem} {/* Pass content to DynamicContent */}
                </section>
            </Modal>
            {/* Main Content */}
            <div className="w-full xs:px-4 md:px-36 flex-col h-full flex justify-center items-center">
                <section className="w-full flex justify-between pl-4 mb-5 items-start">
                    <h1 className="text-3xl font-semibold">
                        {folder?.name || 'Select a folder'}
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
                            Topics in this folder
                        </h2>
                    </section>
                    <section className="w-full mt-2 space-y-6 pt-6">
                        {(!folder?.content?.length) ? (
                            <div className="ml-6 text-gray-500 text-lg font-bold">No topics available</div>
                        ) : (
                            <>
                                {content?.map((item) => {
                                    return (

                                        <InfoCard
                                            Icon={PiChatsCircle}
                                            key={item.id}
                                            // Icon={item.Icon}
                                            title={item.title}
                                            handleCardClick={handleCardClick}  // Add onClick to each InfoCard
                                            description={<DynamicContent content={item.content} />}
                                        />
                                    )
                                })}
                            </>
                        )}
                    </section>
                </section>
            </div>
        </div>
    );
}

export default AddBlog;
