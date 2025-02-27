import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAiLearningSearchMutation, useEditContentByIdMutation, useGetContentByIdMutation, useGetFolderStructureQuery, useMoveContentMutation } from '../../../redux/apis/apiSlice';
import { FaEllipsisV, FaRegFolder } from "react-icons/fa";
import { Editor } from "primereact/editor";
import {
  useAiLearningSearchMutation,
  useEditContentByIdMutation,
  useGetContentByIdMutation,
  useGetFolderStructureQuery,
  useMoveContentMutation,
} from "../../../../redux/apis/apiSlice";
import useAutoRefetchOnReconnect from "../../../../api/useAutoRefetchOnReconnect";
import Modal from "../../../../components/modals/Modal";
import Button from "../../../../components/small/Button";
import DynamicContent from "../../../admin/addBlog/components/DynamicContent";
import QuestionAnswer from "../../../screens/chat/components/QuestionAnswer";
import LibraryInput from "../../../user/library/components/LibraryInput";
import { apiErrorHandler } from "../../../../api/apiErrorHandler";
import FolderSelection from "../../../../components/FolderSelection";
import HtmlContent from "../../../../components/htmlToText";
// import DynamicContent from '../addBlog/components/DynamicContent';
// import Modal from '../../../components/modals/Modal';
// import Button from '../../../components/small/Button';
// import useAutoRefetchOnReconnect from '../../../api/useAutoRefetchOnReconnect';
// import { apiErrorHandler } from '../../../api/apiErrorHandler';
// import LibraryInput from '../../user/library/components/LibraryInput';
// import QuestionAnswer from '../../screens/chat/components/QuestionAnswer';

function CoachesLibraryTopicDetails() {
  const contentId = useSelector((state) => state.sidebar.contentId);
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent] = useEditContentByIdMutation();
  const [getContentById, { data, isError, error, isSuccess, refetch }] =
    useGetContentByIdMutation();
  const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
  const { data: allFolders } = useGetFolderStructureQuery();

  const [isEditModal, setIsEditModal] = useState(false);
  const [editingField, setEditingField] = useState(""); // To identify whether editing title or content
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { data: healthData } = useGetUserHealthHistoryQuery();
  // console.log("healthData",healthData)
  const navigate = useNavigate();
  // Get values from query parameters
  const id = searchParams.get("id");
  const [editData, setEditData] = useState({
    title: "",
    content: "",
  });

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

  useEffect(() => {
    apiErrorHandler(isError, error, isSuccess, "Content loaded successfully!");
  }, [isError, error, isSuccess]);
  useAutoRefetchOnReconnect(refetch);

  const closeContentHandle = () => {
    closeEditModal();
    setEditData((prev) => ({
      ...prev,
      content: data?.content || "",
      title: data?.title || "",
    }));
  };

  // Fetch content by ID
  const fetchContent = async () => {
    try {
      const response = await getContentById(id).unwrap();
      if (response) {
        setEditData({
          title: response.title || "",
          content: response.content || "",
        });
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  // Save edited content
  const handleEditContent = async () => {
    if (!data?.id) {
      toast.error("No content selected!");
      return;
    }

    try {
      const response = await editContent({
        content_id: data?.id,
        new_title: editData.title.trim(), // Send plain text for title
        new_content: editData.content, // Keep HTML for content
        new_query: data?.query, // Assuming query remains unchanged
      }).unwrap();

      toast.success(response.message || "Content updated successfully");
      setIsEditing(false);
      setIsEditModal(false);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error(error.message || "Failed to update content");
    }
  };

  ///for input

  const [selectedFile, setSelectedFile] = useState(null);
  const [chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const lastItemRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiLearningSearch] = useAiLearningSearchMutation();
  const [isAdmin, setIsAdmin] = useState(false);
  const userType = JSON.parse(localStorage.getItem("userType"));


  const dropdownRef = useRef(null);

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
    if (userType && userType.role === "admin") {
      setIsAdmin(true);
    }
  }, [userType]); // Ensure useEffect runs when userType changes

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const handleInputSubmit = async (text) => {
    if (!text.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    if (
      selectedFile &&
      !["application/pdf", "image"].some((type) =>
        selectedFile.type.startsWith(type)
      )
    ) {
      toast.error("Invalid file type. Only PDFs and images are allowed.");
      return;
    }

    const newChat = {
      question: text,
      detailed_answer: "",
      summary: "Streaming...",
      source: "Streaming...",
      audio: null,
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setIsLoading(true);

    try {
      await aiLearningSearch({
        chat_message: {
          user_prompt: text,
          is_new: true,
          regenerate_id: null,
          instructions: "instruction",
        },
        file: selectedFile || null,
        // folder_id: addNewFolderState?.folderId || null,
        onMessage: (streamingText) => {
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            updatedChats[updatedChats.length - 1].detailed_answer =
              streamingText;
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

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    toast.success(`File Uploaded: ${file.name}`);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };
  //end input functionally

  const handleMoveContent = async () => {
    if (!selectedFolder) return toast.error("Please select a folder.");
    // if (content.current_folder_id === selectedFolder) return toast.error("Content is already in this folder.");

    try {
      const response = await moveContent({
        content_id: id,
        target_folder_id: selectedFolder,
      }).unwrap();
      toast.success(response.message);
      closeModal();
      navigate("/admin");
    } catch (error) {
      toast.error(error?.data?.message || "Error moving content.");
    }
  };

  //get the all folder from the api
  function getAllFolders(folderList, result = []) {
    if (!Array.isArray(folderList)) {
      console.error("Invalid input: folderList is not an array", folderList);
      return result;
    }

    folderList.forEach((folder) => {
      // Add the current folder to the result list
      result.push({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        creator_id: folder.creator_id,
        created_at: folder.created_at,
      });

      // Check for subfolders and call recursively
      if (folder.subfolders && Array.isArray(folder.subfolders)) {
        getAllFolders(folder.subfolders, result);
      }
    });

    return result;
  }

  const allFolderss = getAllFolders(allFolders?.posted_topics);

  return (
    <>
      {/* Modal for editing title or content */}
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
        {/* <p className="mb-3">Please select a folder</p>
        {allFolderss?.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedFolder(item.id)}
            className={`flex cursor-pointer hover:bg-gray-200 mt-3 items-center gap-2 p-2 rounded-lg ${
              selectedFolder === item.id
                ? "bg-primary text-white"
                : "bg-gray-100"
              }`}
          >
            <FaRegFolder /> {item.name}
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="bg-gray-400 text-white"
            text="Close"
            onClick={closeModal}
          />
          <Button
            className="bg-blue-500 text-white"
            text="Move"
            disabled={!selectedFolder || isMoving}
            onClick={handleMoveContent}
          />
        </div> */}
        <FolderSelection
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={allFolderss}
          closeModal={closeModal}
          handleMoveContent={handleMoveContent}
          isMoving={isMoving}
        />
      </Modal>
      {/* Main UI */}
      <section className=" h-[calc(100vh-90px)] flex flex-col items-center">
        <div className="h-[90%] custom-scroll mb-2 overflow-auto">
          <div className="w-full flex flex-col justify-center overflow-auto">
            {/* Content Display Section */}
            <section className="flex justify-center  h gap-4">
              
              <div className="custom-scroll overflow-auto w-[80%]  flex  flex-col mt-5 shadow-[#8484850A] rounded-lg p-4 text-black">
                  <section className="flex flex-col   mt-[24px]">
                    <div className="border p-4 rounded-2xl w-[70%] max-w-max ml-auto bg-[#f5f5f5]">
                      <h1 className="text-base md:text-lg text-[#1D1D1F99] font-bold">
                        {editData.title || "No title"}
                      </h1>
                    </div>
                    <div className="border p-4 rounded-2xl w-[70%] max-w-max mr-auto mt-5">
                      <section className="text-[#1D1D1F99] text-xl font-medium">
                       
                        <HtmlContent contents={editData.content} />
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
                    <section ref={dropdownRef} className="absolute w-[150px] top-5 left-[-10px] bg-white shadow-lg rounded-lg">
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

            {chats.length > 0 && (
              <section className="w-full  pb-2 mt-4 custom-scroll overflow-auto">
                {chats.map((chat, i) => (
                  <QuestionAnswer
                    key={i}
                    setIsAdmin={setIsAdmin}
                    isAdmin={isAdmin}
                    chat={chat}
                    lastItemRef={i === chats.length - 1 ? lastItemRef : null}
                  />
                ))}
              </section>
            )}
          </div>
        </div>
        <section className="w-[90%] ">
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
        </section>
      </section>
    </>
  );
}

export default CoachesLibraryTopicDetails;
