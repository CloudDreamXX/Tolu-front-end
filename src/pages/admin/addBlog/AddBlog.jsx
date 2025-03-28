import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CgFileAdd } from 'react-icons/cg';
import { PiChatsCircle } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../components/modals/Modal';
import Button from '../../../components/small/Button';
import {
  useAddNewFolderMutation,
  useAiLearningSearchMutation,
  useDeleteContentByIdMutation,
  useDeleteFolderByIdMutation,
  useEditContentByIdMutation,
  useEditFolderByIdMutation,
  useGetAllPostedContentQuery,
  useGetFolderStructureQuery,
} from '../../../app/store/slice/apiSlice';
// import { setAddFolderData } from '../../../app/store/slice/sidebarSlice';
import {
  setAddFolderData,
  setDetailResponse,
} from '../../../app/store/slice/sidebarSlice';
import QuestionAnswer from '../../screens/chat/components/QuestionAnswer';
import LibraryInput from '../../user/library/components/LibraryInput';
import DynamicContent from './components/DynamicContent';
import FileCard from './components/FileCard';
import InfoCard from './components/InfoCard';
import LibraryTopicDetails from '../libraryTopicDetails/LibraryTopicDetails';
import DetailResponse from './components/DetailResponse';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { SketchPicker } from 'react-color';
import FolderWithColorPicker from '../../../components/FolderWithColorPicker';
import EditFolder from '../../../components/EditFolder';
import HtmlContent from '../../../components/htmlToText';
import AddFiles from './components/AddFiles';
import { FaTimes } from 'react-icons/fa'; // Import the close icon from react-icons
import AddInstruction from './components/AddInstruction';

// import Input from "../small/Input";

function AddBlog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [addFolder, setAddNewFolder] = useState('');
  const [addFolderDescription, setAddFolderDescription] = useState('');
  const [instruction, setInstruction] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);
  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false);
  const editFolderModal = () => setEditFolderModalOpen(true);
  const closeEditFolderModal = () => setEditFolderModalOpen(false);
  const folderName = useSelector((state) => state.sidebar.folderName);
  const [addFilesModal, setAddFilesModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userType = JSON.parse(localStorage.getItem('userType'));
  const navigate = useNavigate();
  const addNewFolderState = useSelector((state) => state.sidebar.addFolder);
  const detailResponse = useSelector((state) => state.sidebar.detailResponse);
  useEffect(() => {
    if (!detailResponse) {
      setChats([]);
    }
  }, [detailResponse]);

  const removeChat = (chatId) => {
    setChats(chats.filter((chat) => chat?.chat_id !== chatId));
  };
  const updateChat = (updatedChat) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_id === updatedChat.chat_id
          ? { ...chat, ...updatedChat }
          : chat
      )
    );
  };

  const [addNewFolder, { isLoading: addNewFolderLoading }] =
    useAddNewFolderMutation();
  const [aiLearningSearch] = useAiLearningSearchMutation();
  const { data: allFolders, refetch } = useGetFolderStructureQuery();
  const [newTitle, setNewTitle] = useState('');
  const [editContent] = useEditContentByIdMutation();
  const [deleteContent] = useDeleteContentByIdMutation();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDetailResponse(false));
  }, [location.pathname]); // Runs when the route (pathname) changes

  const handleEditContent = async () => {
    try {
      if (!selectedItem?.contentId) return;
      const response = await editContent({
        contentId: selectedItem.contentId,
        newTitle,
      }).unwrap();
      toast.success(response.message);
      console.log('Content renamed successfully', response);
      setIsEditing(false);
    } catch (error) {
      console.error('Error renaming content:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteContent = async () => {
    try {
      if (!selectedItem?.contentId) return;
      const response = await deleteContent(selectedItem.contentId).unwrap();
      toast.success(response.message);

      console.log('Content deleted successfully');
      setTopicModalOpen(false);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    dispatch(setAddFolderData({ folderId: null, add: false }));
    setIsModalOpen(false);
  };

  const openInstructionModal = () => setIsInstructionModalOpen(true);
  const closeInstructionModal = () => {
    setIsInstructionModalOpen(false);
    setInstruction(null);
  };

  console.log('instruction', instruction);

  const handleInstructionChange = (e) => {
    setInstruction(e.target.value);
  };
  function findFolderById(folders, id) {
    // Check if folders is a valid array
    if (!Array.isArray(folders)) {
      console.warn('Invalid folders array:', folders);
      return null;
    }
    // Check if id is valid (non-null, non-undefined)
    if (!id) {
      console.warn('Invalid folder id:', id);
      return null;
    }
    for (const folder of folders) {
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

  const folder =
    allFolders && addNewFolderState?.folderId
      ? findFolderById(allFolders, addNewFolderState.folderId)
      : null;

  useEffect(() => {
    if (allFolders && addNewFolderState?.folderId) {
      const folderFromPosted = findFolderById(
        allFolders,
        addNewFolderState.folderId
      );
      console.log('Found folder in posted_topics:', folderFromPosted);
    } else {
      console.warn('Missing allFolders or addNewFolderState.folderId');
    }
  }, [allFolders, addNewFolderState]);

  function findFolderByIdInAllTopics(allFolders, folderId) {
    if (!allFolders || !folderId) {
      console.warn('Invalid data or folderId', { allFolders, folderId });
      return null;
    }
    // Search in posted_topics first
    let folder = Array.isArray(allFolders.posted_topics)
      ? findFolderById(allFolders.posted_topics, folderId)
      : null;

    // If not found, search in saved_topics
    if (!folder && Array.isArray(allFolders.saved_topics)) {
      folder = findFolderById(allFolders.saved_topics, folderId);
    }
    if (!folder && Array.isArray(allFolders.unpublished_topics)) {
      folder = findFolderById(allFolders.unpublished_topics, folderId);
    }
    return folder;
  }

  const folderFound = findFolderByIdInAllTopics(
    allFolders,
    addNewFolderState.folderId
  );
  const content = folderFound?.content ?? [];

  const addInstruction = () => {
    if (instruction.trim() !== '') {
      // Add your logic to save the instruction
      console.log('Added instruction:', instruction);
      if (instruction) {
        localStorage.setItem('instruction', instruction);
      }
      closeInstructionModal();
    }
  };

  const instructionslocal = localStorage.getItem('instruction');

  const handleFolderSubmit = async () => {
    // Check if folder name and folder id are provided
    if (!addFolder.trim() || !addNewFolderState?.folderId) {
      toast.error('Both folder name and folder ID are required!'); // Show toast if either is missing
      return; // Exit the function early
    }

    try {
      const { data, error } = await addNewFolder({
        name: addFolder,
        description: addFolderDescription,
        parent_folder_id: addNewFolderState?.folderId,
      });
      console.log('refetch:', refetch);

      if (error) {
        console.log('Error adding folder:', error);
        toast.error('Failed to add folder!'); // Show toast for failure
      } else {
        console.log('Folder added successfully', data?.message);
        toast.success(data?.message); // Show success toast
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('An error occurred while adding the folder!');
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
    fileInputRef.current.value = '';
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
      toast.error('Please enter a message before submitting.');
      return;
    }
    // if (selectedFile && !["application/pdf", "image"].some(type => selectedFile.type.startsWith(type))) {
    //     toast.error("Invalid file type. Only PDFs and images are allowed.");
    //     return;
    // }

    if (!selectedFile || selectedFile.size === 0) {
      toast.error('File is empty or not provided.');
      return;
    }

    const newChat = {
      question: text,
      detailed_answer: '',
      summary: 'Streaming...',
      source: 'Streaming...',
      audio: null,
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setIsLoading(true);

    try {
      // setIsChat(true)
      dispatch(setDetailResponse(true));
      const { data } = await aiLearningSearch({
        chat_message: {
          user_prompt: text,
          is_new: true,
          regenerate_id: null,
          instructions: instructionslocal,
        },
        files: selectedFile || null,
        folder_id: folderFound?.id || null,
        onMessage: (streamingText) => {
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            updatedChats[updatedChats.length - 1].detailed_answer =
              streamingText;
            return updatedChats;
          });
        },
      });
      const chatId = data.chat_id;
      const folderId = data.folder_id || addNewFolderState?.folderId;

      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChats.length - 1].chat_id = chatId;
        updatedChats[updatedChats.length - 1].folder_id = folderId; // Update folder_id here
        return updatedChats;
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to fetch response.');

      dispatch(setDetailResponse(false));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (addNewFolderState?.add) {
      openModal();
    }
  }, [addNewFolderState?.add]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setNewTitle(item.title);
    setTopicModalOpen(true);
  };
  const clearTopicHandle = () => {
    setChats([]);
    dispatch(setDetailResponse(false));
  };

  useEffect(() => {
    if (userType && userType.role === 'admin') {
      setIsAdmin(true);
    }
  }, [userType]); // Ensure useEffect runs when userType changes
  useEffect(() => {
    if (chats.length === 0) {
      dispatch(setDetailResponse(false));
      navigate('/admin');
    }
  }, [chats, dispatch, navigate]);

  const openAddFileModal = () => {
    setAddFilesModal(true);
  };
  const closeAddFilesModal = () => {
    setAddFilesModal(false);
  };

  return (
    <div className="">
      <Modal
        className={''}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={<h1 className="text-xl font-bold">Create New Folder</h1>}
      >
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

        <section className="flex justify-end mt-8 gap-3">
          <Button
            className={'!bg-[#8E8E8E]  text-white '}
            text="Cancel"
            onClick={closeModal}
          />
          <Button
            className={'!bg-[#B6B6B6] text-[#1D1D1F99]  '}
            text="Add Folder"
            onClick={handleFolderSubmit}
          />
        </section>
      </Modal>
      <Modal
        className="w-[800px]"
        isOpen={isInstructionModalOpen}
        onClose={closeInstructionModal}
        title={<h1 className="text-xl font-bold">Add instructions</h1>}
      >
        <AddInstruction
          handleInstructionChange={handleInstructionChange}
          closeInstructionModal={closeInstructionModal}
          addInstruction={addInstruction}
          instruction={instruction}
        />
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
          <Button
            className="!bg-[#8E8E8E] text-white"
            text="Close"
            onClick={() => setTopicModalOpen(false)}
          />

          <section className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  className="!bg-green-500 text-white"
                  text="Save"
                  onClick={handleEditContent}
                />
                <Button
                  className="!bg-red-500 text-white"
                  text="Cancel"
                  onClick={() => setIsEditing(false)}
                />
              </>
            ) : (
              <Button
                className="!bg-[#B6B6B6] text-[#1D1D1F99]"
                text="Edit"
                onClick={() => setIsEditing(true)}
              />
            )}
            <Button
              className="!bg-[#B6B6B6] text-[#1D1D1F99]"
              text="Delete"
              onClick={handleDeleteContent}
            />
          </section>
        </section>
      </Modal>
      <Modal
        className="w-[500px]"
        isOpen={editFolderModalOpen}
        onClose={closeEditFolderModal}
        title={<h1 className="text-xl font-bold">Edit Folder</h1>}
      >
        <EditFolder
          folder={folder}
          closeEditFolderModal={closeEditFolderModal}
        />
      </Modal>
      <Modal
        className="w-[500px]"
        isOpen={addFilesModal}
        onClose={closeAddFilesModal}
        title={<h1 className="text-xl font-bold">Add Files</h1>}
      >
        <AddFiles
          fetchFile={folderFound?.file_names}
          folder={folderFound}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
      </Modal>
      {!detailResponse && (
        <div className="w-full xs:px-4 md:px-36 flex-col h-full pt-10 flex justify-center items-center">
          <section className="w-full flex justify-between  p-2 mb-5 items-start">
            <h1 className="text-xl capitalize flex items-center gap-2 font-semibold">
              <FolderWithColorPicker folderId={folder?.id} />
              {folderName?.toLowerCase() || 'Select a folder'}
              <section className="cursor-pointer" onClick={editFolderModal}>
                <MdEdit className="text-primary text-base" />
              </section>
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
            fetchFile={folderFound?.file_names}
            folder={folderFound}
          />
          <div className="flex  h-30 xs:flex-col sm:flex-col md:flex-row gap-4 mt-7  w-full">
            <section className="w-full  cursor-pointer">
              <div>
                <FileCard
                  openAddFileModal={openAddFileModal}
                  title="Add Files"
                  description="Increase the accuracy for the AI response by adding files"
                  Icon={CgFileAdd}
                />
              </div>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </section>
            <section
              className="w-full cursor-pointer"
              onClick={openInstructionModal}
            >
              <FileCard
                title="Instructions"
                description={
                  (isAdmin &&
                    'Insert your instructions to refine the AI response') ||
                  (!isAdmin &&
                    'Insert your instructions to refine the AI response')
                }
              />
            </section>
          </div>
          <section className="w-full pl-4 mt-7 items-start justify-start">
            <section className="w-full flex justify-between items-center">
              <h2 className="text-base font-semibold text-center">
                Topics in this folder
              </h2>
            </section>
            <section className="w-full mt-2 space-y-6 pt-6">
              {!folderFound?.content?.length ? (
                <div className="ml-6 text-gray-500 text-lg font-bold">
                  No topics available
                </div>
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
                        handleCardClick={handleCardClick} // Add onClick to each InfoCard
                        description={<HtmlContent contents={item.content} />}
                      />
                    );
                  })}
                </>
              )}
            </section>
          </section>
        </div>
      )}
      {detailResponse && (
        <>
          <section className="h-[calc(100vh-90px)] w-full flex flex-col items-center">
            <section className="h-[90%] custom-scroll w-full mb-2 overflow-auto">
              {chats.map((chat, i) => (
                <DetailResponse
                  key={i}
                  setIsAdmin={setIsAdmin}
                  chat={chat}
                  removeChat={removeChat}
                  updateChat={updateChat}
                />
              ))}
            </section>
            <section className="w-full">
              <LibraryInput
                placeholder="Enter text or upload a file"
                onChangeValue={handleInputChange}
                onSubmitValue={handleInputSubmit}
                onFileUpload={handleFileUpload}
                handleRemoveFile={handleRemoveFile}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
                isLoading={isLoading} // Can be set to `true` when processing
                fetchFile={folderFound?.file_names}
                folder={folderFound}
              />
            </section>
          </section>
        </>
      )}
    </div>
  );
}

export default AddBlog;
