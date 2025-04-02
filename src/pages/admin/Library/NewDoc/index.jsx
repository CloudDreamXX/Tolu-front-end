import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../components/modals/Modal';
import Button from '../../../../components/small/Button';
import LibraryInput from '../../../user/library/components/LibraryInput';
import DetailResponse from '../../addBlog/components/DetailResponse';
import FileCard from '../../addBlog/components/FileCard';
import InfoCard from '../../addBlog/components/InfoCard';
import AddFiles from '../../addBlog/components/AddFiles';
import AddInstruction from '../../addBlog/components/AddInstruction';
import HtmlContent from '../../../../components/htmlToText';
import FolderWithColorPicker from '../../../../components/FolderWithColorPicker';
import EditFolder from '../../../../components/EditFolder';
import {
  useAiLearningSearchMutation,
  useGetFolderStructureQuery,
} from '../../../../app/store/slice/apiSlice';
import {
  setDetailResponse,
} from '../../../../app/store/slice/sidebarSlice';
import { CgFileAdd } from 'react-icons/cg';
import { PiChatsCircle } from 'react-icons/pi';
import { MdEdit } from 'react-icons/md';
import HelpSection from '../../../../shared/ui/HelpSection';

function NewDoc() {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState(null);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [addFilesModal, setAddFilesModal] = useState(false);
  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [topicModalOpen, setTopicModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addNewFolderState = useSelector((state) => state.sidebar.addFolder);
  const detailResponse = useSelector((state) => state.sidebar.detailResponse);
  const folderName = useSelector((state) => state.sidebar.folderName);
  const { data: allFolders } = useGetFolderStructureQuery();
  const [aiLearningSearch] = useAiLearningSearchMutation();

  const instructionslocal = localStorage.getItem('instruction');

  const findFolderById = (folders, id) => {
    if (!Array.isArray(folders) || !id) return null;
    for (const folder of folders) {
      if (folder?.id === id) return folder;
      if (Array.isArray(folder?.subfolders)) {
        const result = findFolderById(folder.subfolders, id);
        if (result) return result;
      }
    }
    return null;
  };

  const folderFound = findFolderById(allFolders, addNewFolderState.folderId);

  const handleInputChange = (value) => setInputValue(value);

  const handleInputSubmit = async (text) => {
    if (!text.trim()) {
      toast.error('Please enter a message before submitting.');
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
      dispatch(setDetailResponse(true));
      const { data } = await aiLearningSearch({
        chat_message: {
          user_prompt: text,
          is_new: true,
          regenerate_id: null,
          instructions: instructionslocal,
        },
        files: selectedFile || null,
        folder_id: folderFound?.id || addNewFolderState?.folderId || null,
        onMessage: (streamingText) => {
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            updatedChats[updatedChats.length - 1].detailed_answer = streamingText;
            return updatedChats;
          });
        },
      });
      const chatId = data.chat_id;
      const folderId = data.folder_id || addNewFolderState?.folderId;

      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChats.length - 1].chat_id = chatId;
        updatedChats[updatedChats.length - 1].folder_id = folderId;
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

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    toast.success(`File Uploaded: ${file.name}`);
  };

  const handleRemoveFile = () => setSelectedFile(null);

  const openInstructionModal = () => setIsInstructionModalOpen(true);
  const closeInstructionModal = () => setIsInstructionModalOpen(false);

  const addInstruction = () => {
    if (instruction.trim() !== '') {
      localStorage.setItem('instruction', instruction);
      closeInstructionModal();
    }
  };

  const openAddFileModal = () => setAddFilesModal(true);
  const closeAddFilesModal = () => setAddFilesModal(false);

  const openEditFolderModal = () => setEditFolderModalOpen(true);
  const closeEditFolderModal = () => setEditFolderModalOpen(false);

  const clearTopics = () => {
    setChats([]);
    dispatch(setDetailResponse(false));
  };

  return (
    <>
      <Modal
        className="w-[800px]"
        isOpen={isInstructionModalOpen}
        onClose={closeInstructionModal}
        title={<h1 className="text-xl font-bold">Add Instructions</h1>}
      >
        <AddInstruction
          handleInstructionChange={(e) => setInstruction(e.target.value)}
          closeInstructionModal={closeInstructionModal}
          addInstruction={addInstruction}
          instruction={instruction}
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
      <Modal
        className="w-[500px]"
        isOpen={editFolderModalOpen}
        onClose={closeEditFolderModal}
        title={<h1 className="text-xl font-bold">Edit Folder</h1>}
      >
        <EditFolder folder={folderFound} closeEditFolderModal={closeEditFolderModal} />
      </Modal>
      {!detailResponse && (
        <div className="w-full xs:px-4 md:px-36 flex-col h-[85vh] pt-10 flex gap-4 justify-between items-center">
          <HelpSection 
            sectionTitle="Hi, how can I help you?"
            openAddFileModal={openAddFileModal}
            openInstructionModal={openInstructionModal}
          />
          <LibraryInput
            placeholder="Enter text or upload a file"
            onChangeValue={handleInputChange}
            onSubmitValue={handleInputSubmit}
            onFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            isLoading={isLoading}
            fetchFile={folderFound?.file_names}
            folder={folderFound}
          />
        </div>
      )}
      {detailResponse && (
        <section className="h-[calc(100vh-90px)] w-full flex flex-col items-center">
          <section className="h-[80%] custom-scroll w-full mb-2 overflow-auto">
            {chats.map((chat, i) => (
              <DetailResponse
                key={i}
                chat={chat}
                removeChat={(chatId) =>
                  setChats((prevChats) =>
                    prevChats.filter((chat) => chat.chat_id !== chatId)
                  )
                }
                updateChat={(updatedChat) =>
                  setChats((prevChats) =>
                    prevChats.map((chat) =>
                      chat.chat_id === updatedChat.chat_id
                        ? { ...chat, ...updatedChat }
                        : chat
                    )
                  )
                }
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
              isLoading={isLoading}
              fetchFile={folderFound?.file_names}
              folder={folderFound}
            />
          </section>
        </section>
      )}
    </>
  );
}

export default NewDoc;
