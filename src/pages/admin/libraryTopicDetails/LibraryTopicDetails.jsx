// import React, { useState } from 'react';
// import { CiCalendarDate, CiClock2 } from "react-icons/ci";
// import { FaHeadphonesAlt } from "react-icons/fa";
// import { IoReturnUpBackOutline } from "react-icons/io5";
// import Button from '../../../components/small/Button';
// import LibraryInput from '../../user/library/components/LibraryInput';
// import Card from './components/Card';
// import { useSelector } from 'react-redux';
// import DynamicContent from '../addBlog/components/DynamicContent';
// import { FiSend } from "react-icons/fi";

// import { FaSave } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import { RiDeleteBinLine } from "react-icons/ri";
// import toast from 'react-hot-toast';
// import { useEditContentByIdMutation } from '../../../redux/apis/apiSlice';

// const LibraryTopicDetails = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const contentId = useSelector((state) => state.sidebar.contentId);
//   const handleInputChange = (value) => setInputValue(value);
//   const [newTitle, setNewTitle] = useState(contentId.title);

//   const handleSubmitValue = (value) => {
//     alert(`Submitted Value: ${value}`);
//     setInputValue('');
//   };
//   const handleFileUpload = (file) => {
//     console.log("Uploaded File:", file.name);
//     alert(`File Uploaded: ${file.name}`);
//   };

//   console.log("contentId", contentId)

//   const handle = () => {
//     console.log("hugyftfhgvh")
//   }
//   const [isEditing, setIsEditing] = useState(false);

//   const [editContent] = useEditContentByIdMutation();


//   const handleEditContent = async () => {
//     try {
//       // if (!selectedItem?.contentId) return;
//       const response = await editContent({ contentId: contentId.id, newTitle }).unwrap();
//       toast.success(response.message);
//       console.log("Content renamed successfully", response);
//       // setTopicModalOpen(false)
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error renaming content:", error);
//       toast.error(error.message);
//     }
//   };


//   return (
//     <div className="w-full flex  justify-center gap-4 h-full">
//       <section className='flex  flex-col gap-4  mt-5 text-primary'>
//         <FiSend className=' hover:text-black cursor-pointer' onClick={handle} />
//         <FaSave className=' hover:text-black cursor-pointer' onClick={handleEditContent} />
//         <CiEdit className=' hover:text-black cursor-pointer' onClick={() => { setIsEditing(true) }} />
//         <RiDeleteBinLine className=' hover:text-black cursor-pointer' onClick={handle} />
//       </section>
//       <div className="bg-red-200 overflow-auto w-[80%] flex flex-col  border mt-5 h-[calc(100vh-130px)] shadow-[#8484850A] rounded-lg p-4 text-black">
//         <section className="flex flex-col gap-4">
//           <section className="mt-4 overflow-auto">
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={newTitle}
//                 onBlur={() => handleEditContent(contentId.id)} // Pass content id on blur
//                 onKeyDown={(e) => e.key === "Enter" && handleEditContent(contentId.id)} // Pass folder id on Enter key press
//                 onChange={(e) => setNewTitle(e.target.value)}
//                 className="border border-gray-300 p-2 rounded w-full"
//               />
//             ) : (
//               <h2 className="text-lg font-semibold">{contentId?.title}</h2>
//             )}
//           </section>
//           <h1 className="text-3xl text-[#1D1D1F99] font-bold">{contentId.title}</h1>
//         </section>
//         <section className="flex flex-col bg-green-200  overflow-auto mt-[24px]">
//           <section className="text-[#1D1D1F99] text-xl font-medium">
//             {<DynamicContent content={contentId?.content} />}
//           </section>
//         </section>
//         <section className="flex flex-col">
//         </section>
//       </div>

//     </div>
//   );
// };

// export default LibraryTopicDetails;
import React, { useState } from 'react';
import { FiSend } from "react-icons/fi";
import { FaSave, FaHeadphonesAlt } from "react-icons/fa";
import { CiEdit, CiCalendarDate, CiClock2 } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useEditContentByIdMutation } from '../../../redux/apis/apiSlice';
import DynamicContent from '../addBlog/components/DynamicContent';
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { AiOutlineMenuFold } from "react-icons/ai";

const LibraryTopicDetails = () => {
  const contentId = useSelector((state) => state.sidebar.contentId);
  const [newTitle, setNewTitle] = useState(contentId?.title || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent] = useEditContentByIdMutation();

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
            <DynamicContent content={contentId?.content} />
          </section>
        </section>
      </div>
    </div>
  );
};

export default LibraryTopicDetails;