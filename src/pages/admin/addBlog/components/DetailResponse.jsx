import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import DynamicContent from './DynamicContent';
import Modal from '../../../../components/modals/Modal';
import FolderSelection from '../../../../components/FolderSelection';
import { Editor } from "primereact/editor";
import { useEditContentByIdMutation, useGetFolderStructureQuery, useMoveContentMutation } from '../../../../redux/apis/apiSlice';
import useAutoRefetchOnReconnect from '../../../../api/useAutoRefetchOnReconnect';
import Button from '../../../../components/small/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDetailResponse } from '../../../../redux/slice/sidebarSlice';
import HtmlContent from '../../../../components/htmlToText';

function DetailResponse({ chat, removeChat, updateChat }) {
  // const [isEditing, setIsEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent] = useEditContentByIdMutation();
  const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
  const { data: allFolders } = useGetFolderStructureQuery();
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingField, setEditingField] = useState(""); // To identify whether editing title or content
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (chat) {
      setEditData({
        title: chat?.question || "",
        content: chat?.detailed_answer || "",
      });
    }
  }, [chat])



  const openEditModal = (field) => {
    setEditingField(field);
    setIsEditModal(true);
  };

  const closeEditModal = () => {
    setIsEditModal(false);
    setEditingField("");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFolder(null);
  };

  // useEffect(() => {
  //   apiErrorHandler(isError, error, isSuccess, "Content loaded successfully!");
  // }, [isError, error, isSuccess]);
  // useAutoRefetchOnReconnect(refetch);

  const closeContentHandle = () => {
    closeEditModal();
    setEditData((prev) => ({
      ...prev,
      content: chat?.detailed_answer || "",
      title: chat?.question || "",
    }));
  };
  const handleEditContent = async () => {
    if (!chat?.chat_id) {
      toast.error("No content selected!");
      return;
    }

    // Determine final values: if the new title or content is empty, use the previous data.
    const finalTitle = editData.title.trim() === '' ? chat.question : editData.title.trim();
    const finalContent = editData.content.trim() === '' ? chat.detailed_answer : editData.content;

    try {
      const response = await editContent({
        content_id: chat.chat_id,
        new_title: finalTitle, // Use final title
        new_content: finalContent, // Use final content
        new_query: chat.question,  // Assuming query remains unchanged
      }).unwrap();

      toast.success(response.message || "Content updated successfully");

      // Update parent's state with the new (or fallback) values.
      updateChat({
        chat_id: chat.chat_id,
        question: finalTitle,
        detailed_answer: finalContent,
      });

      setIsEditing(false);
      setIsEditModal(false);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error(error.message || "Failed to update content");
    }
  };

  const handleMoveContent = async () => {
    if (!selectedFolder) return toast.error("Please select a folder.");
    // if (content.current_folder_id === selectedFolder) return toast.error("Content is already in this folder.");

    try {
      const response = await moveContent({
        content_id: chat.chat_id,
        target_folder_id: selectedFolder,
      }).unwrap();
      toast.success(response.message);
      closeModal();
      removeChat(chat.chat_id);
      // dispatch(setDetailResponse(false));
      // navigate("/admin");
    } catch (error) {
      toast.error(error?.data?.message || "Error moving content.");
    }
  };


  return (
    <div>
      <Modal
        className="w-[800px] max-h-[600px] overflow-auto"
        isOpen={isEditModal}
        onClose={closeEditModal}
        title={
          <h1 className="text-xl font-bold">
            Edit {editingField === "title" ? "Title" : "Content"}
          </h1>
        }
      >
        {editingField === "title" ? (
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                title: e.target.value, // Plain text input
              }))
            }
            className="w-full p-2 border rounded-md"
            placeholder="Enter title here"
          />
        ) : (
          <Editor
            style={{ height: "320px" }}
            value={editData.content}
            onTextChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                content: e.htmlValue, // Rich text for content
              }))
            }
          />
        )}
        <section className="flex justify-end gap-4 mt-4">
          <Button
            className={"!bg-[#8E8E8E] text-white "}
            text="Close"
            onClick={closeContentHandle}
          />
          <Button
            className={"!bg-[#B6B6B6] text-[#1D1D1F99] "}
            text="Save Changes"
            onClick={handleEditContent}
          />
        </section>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={<h1 className="text-xl font-bold">Post Content</h1>}
      >
        <FolderSelection
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={allFolders?.posted_topics}
          closeModal={closeModal}
          handleMoveContent={handleMoveContent}
          isMoving={isMoving}
        />
      </Modal>
      <section className="flex justify-center w-full  overflow-auto h gap-4">
        <section className="flex justify-center w-full  overflow-auto h gap-4">
          <div className="custom-scroll overflow-auto w-[80%] flex  flex-col mt-5 shadow-[#8484850A] rounded-lg p-4 text-black">
            <section className="flex flex-col  mt-[24px]">
              <div className="border p-4 rounded-2xl w-[70%] max-w-max ml-auto bg-[#f5f5f5]">
                <h1 className="text-base md:text-lg text-[#1D1D1F99] font-bold">
                  {chat.question || "No title"}
                </h1>
              </div>
              <div className="border p-4 rounded-2xl w-[70%]  max-w-max mr-auto mt-5">
                <section className="text-[#1D1D1F99] text-xl font-medium">

                  <HtmlContent contents={chat.detailed_answer} />
                </section>
              </div>
            </section>
          </div>
          <section className="flex flex-col gap-4 mt-5 text-primary">
            <section className="flex  shadow-lg  rounded-3xl w-12 h-9 items-center justify-center">
              <AiOutlineMenuFold
                onClick={() => setIsModalOpen(true)}
                className="hover:text-black cursor-pointer text-lg"
              />
            </section>
            <section className="flex  shadow-lg  rounded-3xl w-12 h-9 items-center justify-center">
              <IoIosSave
                className="hover:text-black  cursor-pointer text-lg"
              //  onClick={handleEditContent}
              />
            </section>
            <section className="relative">
              <section className="flex  shadow-lg  rounded-3xl w-12 h-9 items-center justify-center">
                <FaRegEdit
                  className="hover:text-black cursor-pointer text-lg"
                  onClick={() => setIsEditing(!isEditing)}
                />
              </section>
              {isEditing && (
                <section ref={dropdownRef} className='absolute w-[150px] top-5 left-[-10px] bg-white shadow-lg rounded-lg'>
                  <section
                    onClick={() => {
                      openEditModal("title"), setIsEditing(false);
                    }}
                    className="w-full p-2 text-white flex items-center cursor-pointer justify-center hover:bg-gray-500 bg-primary"
                  >
                    Edit Title
                  </section>
                  <section
                    onClick={() => {
                      openEditModal("content"), setIsEditing(false);
                    }}
                    className="w-full p-2 text-white flex items-center cursor-pointer justify-center hover:bg-gray-500 bg-primary"
                  >
                    Edit Content
                  </section>
                </section>
              )}
            </section>
            <section className="flex  shadow-lg  rounded-3xl w-12 h-9 items-center justify-center">
              <RiDeleteBinLine className="hover:text-black cursor-pointer text-lg" />
            </section>
          </section>
        </section>
      </section>
    </div>
  )
}

export default DetailResponse