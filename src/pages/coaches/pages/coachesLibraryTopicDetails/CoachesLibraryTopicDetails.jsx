import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSearchParams } from 'react-router-dom';
import { useAiLearningSearchMutation, useEditContentByIdMutation, useGetContentByIdMutation } from '../../../../redux/apis/apiSlice';
import DynamicContent from '../../../admin/addBlog/components/DynamicContent';
import QuestionAnswer from '../../../screens/chat/components/QuestionAnswer';
import LibraryInput from '../../../user/library/components/LibraryInput';

function CoachesLibraryTopicDetails() {

  const [selectedFile, setSelectedFile] = useState(null);

  // const contentId = useSelector((state) => state.sidebar.contentId);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent] = useEditContentByIdMutation();
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [aiLearningSearch] = useAiLearningSearchMutation();
  const [isAdmin, setIsAdmin] = useState(false);

  const userType = JSON.parse(localStorage.getItem("userType"));

  useEffect(() => {
    if (userType && userType.role === "admin") {
      setIsAdmin(true);
    }
  }, [userType]);  // Ensure useEffect runs when userType changes

  const lastItemRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Get values from query parameters
  const id = searchParams.get("id");
  const folderId = searchParams.get("folderId");

  console.log("ID:", id, "Folder ID:", folderId);
  ;

  const handleEditContent = async () => {
    if (!id) {
      toast.error("No content selected!");
      return;
    }
    try {
      const response = await editContent({ contentId: id, newTitle }).unwrap();
      toast.success(response.message || "Content renamed successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming content:", error);
      toast.error(error.message || "Failed to rename content");
    }
  };


  const [getContentById, { data, error, isLoading: contentLoading }] = useGetContentByIdMutation();

  const fetchContent = async () => {
    try {
      await getContentById(id).unwrap(); // Call API and unwrap response

    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  useEffect(() => {
    fetchContent()
  }, [id])
  console.log("data", data);
  const [newTitle, setNewTitle] = useState(data?.title || '');

  const handleInputChange = (value) => {
    setInputValue(value);
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
        chat_message: { user_prompt: text, is_new: true, regenerate_id: null, instructions: "instruction" },
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
  const handleFileUpload = (file) => {
    console.log("Uploaded File:", file.name);
    // const file = event.target.files[0];
    setSelectedFile(file);
    toast.success(`File Uploaded: ${file.name}`);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };


  return (
    <>
      {id && (

        <div className="w-full flex flex-col items-center justify-center gap-4 h-full">
          <section className='flex'>

            <section className='flex flex-col gap-4 mt-5 text-primary'>
              <AiOutlineMenuFold className='hover:text-black cursor-pointer' />
              <IoIosSave className='hover:text-black cursor-pointer' onClick={handleEditContent} />
              <FaRegEdit className='hover:text-black cursor-pointer' onClick={() => setIsEditing(true)} />
              <RiDeleteBinLine className='hover:text-black cursor-pointer' />
            </section>
            <div className=" custom-scroll overflow-auto w-[80%] flex flex-col border mt-5 h-[calc(100vh-250px)] shadow-[#8484850A] rounded-lg p-4 text-black">
              <section className="flex flex-col gap-4">
                <section className="mt-4 overflow-auto">
                  {isEditing ? (
                    <input
                      type="text"
                      value={newTitle}
                      onBlur={handleEditContent}
                      onKeyDown={(e) => e.key === "Enter" && handleEditContent()}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    // null
                    <>
                      <h2 className="text-lg font-semibold">{data?.title}</h2>
                      tytfug
                    </>

                    // <h1 className="text-3xl text-[#1D1D1F99] font-bold">{contentId?.title}</h1>
                  )}
                </section>
                {/* <h2 className="text-lg font-semibold">{data?.title}</h2> */}

              </section>
              <section className="flex flex-col custom-scroll overflow-auto mt-[24px]">
                <section className="text-[#1D1D1F99] text-xl font-medium">
                  <DynamicContent content={data?.content} />
                </section>
              </section>
            </div>
          </section>
          {chats.length > 0 && (

            <section className='w-full  pb-2 mt-4 custom-scroll overflow-auto'>

              {chats.map((chat, i) => (
                <QuestionAnswer key={i} setIsAdmin={setIsAdmin} isAdmin={isAdmin} chat={chat} lastItemRef={i === chats.length - 1 ? lastItemRef : null} />
              ))}
            </section>
          )}
          <section className=' flex justify-center w-[80%] items-center gap-4 h-full bg-red-200'>

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
        </div>
      )}


    </>

  )
}

export default CoachesLibraryTopicDetails