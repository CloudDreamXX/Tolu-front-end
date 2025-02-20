import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEditContentByIdMutation, useGetContentByIdMutation } from '../../../redux/apis/apiSlice';
import DynamicContent from '../addBlog/components/DynamicContent';

const LibraryTopicDetails = () => {
  const contentId = useSelector((state) => state.sidebar.contentId);
  const [newTitle, setNewTitle] = useState(contentId?.title || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent] = useEditContentByIdMutation();
  const [searchParams] = useSearchParams();

  // Get values from query parameters
  const id = searchParams.get("id");
  const folderId = searchParams.get("folderId");



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


  const handleEditContent = async () => {
    if (!contentId?.id) {
      toast.error("No content selected!");
      return;
    }
    try {
      const response = await editContent({ contentId: contentId.id, newTitle }).unwrap();
      toast.success(response.message || "Content renamed successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming content:", error);
      toast.error(error.message || "Failed to rename content");
    }
  };

  return (
    <div className="w-full flex justify-center gap-4 h-full">
      <section className='flex flex-col gap-4 mt-5 text-primary'>
        <AiOutlineMenuFold className='hover:text-black cursor-pointer' />
        <IoIosSave className='hover:text-black cursor-pointer' onClick={handleEditContent} />
        <FaRegEdit className='hover:text-black cursor-pointer' onClick={() => setIsEditing(true)} />
        <RiDeleteBinLine className='hover:text-black cursor-pointer' />
      </section>
      <div className=" custom-scroll overflow-auto w-[80%] flex flex-col border mt-5 h-[calc(100vh-130px)] shadow-[#8484850A] rounded-lg p-4 text-black">
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
              null
              // <h2 className="text-lg font-semibold">{contentId?.title}</h2>
              // <h1 className="text-3xl text-[#1D1D1F99] font-bold">{contentId?.title}</h1>
            )}
          </section>
        </section>
        <section className="flex flex-col custom-scroll overflow-auto mt-[24px]">
          <section className="text-[#1D1D1F99] text-xl font-medium">
            <DynamicContent content={data?.content} />
          </section>
        </section>
      </div>
    </div>
  );
};

export default LibraryTopicDetails;