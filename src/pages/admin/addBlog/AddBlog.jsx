import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CgFileAdd } from 'react-icons/cg';
import { PiChatsCircle } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/modals/Modal';
import Button from '../../../components/small/Button';
import { useAddNewFolderMutation, useAiLearningSearchMutation, useDeleteContentByIdMutation, useDeleteFolderByIdMutation, useEditContentByIdMutation, useEditFolderByIdMutation, useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
// import { setAddFolderData } from '../../../redux/slice/sidebarSlice';
import { setAddFolderData } from '../../../redux/slice/sidebarSlice';
import QuestionAnswer from '../../screens/chat/components/QuestionAnswer';
import LibraryInput from '../../user/library/components/LibraryInput';
import DynamicContent from './components/DynamicContent';
import FileCard from './components/FileCard';
import InfoCard from './components/InfoCard';
// import Input from "../small/Input";

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
    const [folderId, setFolderId] = useState("");
    const [contentId, setContentId] = useState("");
    const [newName, setNewName] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [title, setTitle] = useState("");
    const [editFolder] = useEditFolderByIdMutation();
    const [deleteFolder] = useDeleteFolderByIdMutation();
    const [editContent] = useEditContentByIdMutation();
    const [deleteContent] = useDeleteContentByIdMutation();
    const handleEditFolder = async () => {
        try {
            await editFolder({ folderId, newName }).unwrap();
            console.log("Folder renamed successfully");
        } catch (error) {
            console.error("Error renaming folder:", error);
        }
    };

    const handleDeleteFolder = async () => {
        try {
            await deleteFolder(folderId).unwrap();
            console.log("Folder deleted successfully");
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };



    const handleEditContent = async () => {
        try {
            if (!selectedItem?.contentId) return;
            const response = await editContent({ contentId: selectedItem.contentId, newTitle }).unwrap();
            toast.success(response.message);
            console.log("Content renamed successfully", response);
            setIsEditing(false);
        } catch (error) {
            console.error("Error renaming content:", error);
            toast.error(error.message);
        }
    };

    const handleDeleteContent = async () => {
        try {
            if (!selectedItem?.contentId) return;
            const response = await deleteContent(selectedItem.contentId).unwrap();
            toast.success(response.message);

            console.log("Content deleted successfully");
            setTopicModalOpen(false);
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };



    ////



    const dispatch = useDispatch();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        dispatch(setAddFolderData({ folderId: null, add: false })); // Assuming you want to set the selected folder ID here
        ; setIsModalOpen(false)
    };

    const openInstructionModal = () => setIsInstructionModalOpen(true);
    const closeInstructionModal = () => {
        setIsInstructionModalOpen(false)
        setInstruction(null);
    };


    const lastItemRef = useRef(null);

    const handleInstructionChange = (e) => {
        setInstruction(e.target.value);
    };


    function findFolderById(folders, id) {
        // Check if folders is a valid array
        if (!Array.isArray(folders)) {
            console.warn("Invalid folders array:", folders);
            return null;
        }
        // Check if id is valid (non-null, non-undefined)
        if (!id) {
            console.warn("Invalid folder id:", id);
            return null;
        }

        for (const folder of folders) {
            //   console.log("Checking folder:", folder?.id);
            if (folder?.id === id) {
                return folder; // Folder found
            }
            if (Array.isArray(folder?.subfolders) && folder.subfolders.length > 0) {
                const result = findFolderById(folder.subfolders, id);
                if (result) return result;
            }
        }
        return null; // Folder not found
    }

    // Ensure allFolders and addNewFolderState exist and have the expected properties
    const folder =
        allFolders?.posted_topics && addNewFolderState?.folderId
            ? findFolderById(allFolders.posted_topics, addNewFolderState.folderId)
            : null;

    const content = folder?.content ?? []; // Use an empty array if folder.content is undefined


    useEffect(() => {
        if (allFolders?.posted_topics && addNewFolderState?.folderId) {
            const folderFromPosted = findFolderById(allFolders.posted_topics, addNewFolderState.folderId);
            console.log("Found folder in posted_topics:", folderFromPosted);
        } else {
            console.warn("Missing allFolders.posted_topics or addNewFolderState.folderId");
        }
    }, [allFolders, addNewFolderState]);

    const addInstruction = () => {
        if (instruction.trim() !== '') {
            // Add your logic to save the instruction
            console.log("Added instruction:", instruction);
            if (instruction) {
                localStorage.setItem('instruction', instruction);
            }
    

            // Clear the input after adding
           

            // Close the modal
            closeInstructionModal();
        }
    };
    
    const instructionslocal = localStorage.getItem('instruction');
    console.log('content',instructionslocal)


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
    const handleRemoveFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = "";
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        toast.success(`File Uploaded: ${file.name}`);
    };
    const handleFileUpload = (file) => {
        setSelectedFile(file);
        toast.success(`File Uploaded: ${file.name}`);
    };
    const handleFileCardClick = () => {
        document.getElementById('file-input').click();
    };

    const handleInputSubmit = async (text) => {
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
                chat_message: { user_prompt: text, is_new: true, regenerate_id: null, instructions: instructionslocal },
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
            setSelectedFile(null);
        } catch (error) {
            console.error("Error sending request:", error);
            toast.error("Failed to fetch response.");
        } finally {
            setIsLoading(false);

        }
    };


    useEffect(() => {
        if (addNewFolderState?.add) {
            openModal();
        }
    }, [addNewFolderState?.add]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [topicModalOpen, setTopicModalOpen] = useState(false);
    const handleCardClick = (item) => {
        setSelectedItem(item);
        setNewTitle(item.title);
        setTopicModalOpen(true);
    };
    const clearTopicHandle = () => {
        setChats([])
    }

    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const userType = JSON.parse(localStorage.getItem("userType"));

    useEffect(() => {
        if (userType && userType.role === "admin") {
            setIsAdmin(true);
        }
    }, [userType]);  // Ensure useEffect runs when userType changes


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

            <Modal className="w-[800px]" isOpen={isInstructionModalOpen} onClose={closeInstructionModal} title={<h1 className="text-xl font-bold">Add personalize topic</h1>}>
                <textarea
                    className="w-full mt-4 h-40 p-4 border rounded"
                    placeholder="Enter personalize topic here..."
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
                        text="Add personalize topic"
                        onClick={addInstruction}
                    />
                </section>
            </Modal>

            <Modal
                className="w-[500px] lg:w-[700px] max-h-[600px] custom-scroll overflow-auto"
                isOpen={topicModalOpen}
                onClose={() => setTopicModalOpen(false)}
                title={<h1 className="text-xl font-bold">Topic Details</h1>}
            >
                {/* Editable Title Section */}
                <section className="mt-4 overflow-auto">
                    {isEditing ? (
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    ) : (
                        <h2 className="text-lg font-semibold">{selectedItem?.title}</h2>
                    )}
                </section>

                {/* Description */}
                <section className="mt-4 overflow-auto">
                    {selectedItem?.description}
                </section>

                {/* Buttons */}
                <section className="flex justify-between gap-2 mt-4">
                    <Button className="!bg-[#8E8E8E] text-white" text="Close" onClick={() => setTopicModalOpen(false)} />

                    <section className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button className="!bg-green-500 text-white" text="Save" onClick={handleEditContent} />
                                <Button className="!bg-red-500 text-white" text="Cancel" onClick={() => setIsEditing(false)} />
                            </>
                        ) : (
                            <Button className="!bg-[#B6B6B6] text-[#1D1D1F99]" text="Edit" onClick={() => setIsEditing(true)} />
                        )}
                        <Button className="!bg-[#B6B6B6] text-[#1D1D1F99]" text="Delete" onClick={handleDeleteContent} />
                    </section>
                </section>
            </Modal>
            {/* <Modal className="w-[800px]" isOpen={isInstructionModalOpen} onClose={closeInstructionModal} title={<h1 className="text-xl font-bold">Add personalize topic</h1>}>
                <section className='h-[400px] custom-scroll overflow-auto'>
                    <section className='flex gap-4 mb-4'>

                        <section className='text-2xl font-medium'>
                            Health Status
                        </section>
                        <section className='flex gap-4 '>
                            <button className='hover:underline cursor-pointer '>Edit</button>
                            <button className='hover:underline cursor-pointer '>Save</button>

                        </section>

                    </section>
                    <section className='space-y-7'>

                        <CustomInput
                            className=''
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                    </section>
                    <section className='flex gap-4 mt-4 mb-4'>

                        <section className='text-2xl font-medium'>
                            Lifestyle & Habits
                        </section>
                        <section className='flex gap-4 '>
                            <button className='hover:underline cursor-pointer '>Edit</button>
                            <button className='hover:underline cursor-pointer '>Save</button>

                        </section>

                    </section>
                    <section>
                        <CustomInput
                            className='mt-2'
                            type="text"
                            label="Current health concerns or symptoms (Multiple choice drop down)"
                            placeholder="Fatigue, Insomnia, Weight Gain"
                            name="instruction"
                        // onChange={formDataChangeHandler}
                        />
                    </section>

                </section>
            </Modal> */}

            {/* Main Content */}
            <div className="w-full xs:px-4 md:px-36 flex-col h-full pt-10 flex justify-center items-center">
                <section className="w-full flex justify-between  p-2 mb-5 items-start">
                    <h1 className="text-3xl font-semibold">
                        {folder?.name || 'Select a folder'}
                    </h1>
                    <section>
                        <Button
                            className="!bg-[#B6B6B6] text-[#1D1D1F99] "
                            text="Clear Topics"
                            onClick={clearTopicHandle}
                        />

                    </section>
                </section>
                <LibraryInput
                    placeholder="Enter text or upload a file"
                    onChangeValue={handleInputChange}
                    onSubmitValue={handleInputSubmit}
                    onFileUpload={handleFileUpload}
                    handleRemoveFile={handleRemoveFile}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                    isLoading={isLoading} // Can be set to `true` when processing
                />
                {chats.length > 0 && (

                    <section className='w-full  pb-2 mt-4 custom-scroll overflow-auto'>

                        {chats.map((chat, i) => (
                            <QuestionAnswer key={i} setIsAdmin={setIsAdmin} isAdmin={isAdmin} chat={chat} lastItemRef={i === chats.length - 1 ? lastItemRef : null} />
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
                            description={isAdmin && "Insert your instructions to attach with prompt" || !isAdmin && "Personalize your content using client data"}
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
                                            contentId={item.id}
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
