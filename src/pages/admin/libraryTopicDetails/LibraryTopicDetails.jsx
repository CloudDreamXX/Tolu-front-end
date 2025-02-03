// import React, { useState } from 'react';
// import Button from '../../../components/small/Button';
// import { IoReturnUpBackOutline } from "react-icons/io5";
// import { FaHeadphonesAlt } from "react-icons/fa";
// import { CiCalendarDate } from "react-icons/ci";

// import { CiClock2 } from "react-icons/ci";
// import LibraryInput from '../../user/library/components/LibraryInput';
// import Card from './components/Card';

// function LibraryTopicDetails() {

//   const handleInputChange = (value) => {
//     setInputValue(value);
//   };

//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleSubmitValue = (value) => {
//     alert(`Submitted Valuekhgjyfyyg: ${value}`);
//     setInputValue('');
//   };
//   const handleFileUpload = (file) => {
//     console.log("Uploaded File:", file.name);
//     alert(`File Uploaded: ${file.name}`);
//   };

//   return (
//     <div className=" w-full ">
//       <div className="grid grid-cols-12 gap-1">

//         <div className="  col-span-12 md:col-span-9 p-4 text-white">
//           <section>
//             <Button
//               onClick={() => {
//                 history.push("/admin");
//               }}
//               className="col-span-1 !h-9 !rounded-xl !p-4 text-[#1D1D1F99] !py-0 !bg-[#ACACAC]"
//             >
//               <IoReturnUpBackOutline className='text-xl' />

//               Back
//             </Button>
//           </section>
//           <div className=" bg-white border mt-5 shadow-[#8484850A] rounded-lg p-4 text-black">
//             <section className='flex flex-col gap-4'>
//               <h1 className="text-3xl text-[#1D1D1F99] font-bold">Library Topic Details</h1>
//               <section className='flex flex-col gap-3 text-[#1D1D1F99] text-sm font-medium'>

//                 <text className=''>
//                 Related Topics

//                 </text>
//                 <text className='text-[#1D1D1F99] text-sm font-medium'>
//                 (Source: Journal of Nutrition)
//                 </text>
//                 <section className='flex items-center gap-2'>
//                   <CiCalendarDate />
//                   <text className='text-[#1D1D1F99] text-sm font-medium'>
//                   13 January, 2025
//                   </text>
//                 </section>
//               </section>
//             </section>
//             <section className='flex items-center justify-between gap-4 '>
//               <section className='text-[#1D1D1F99] text-sm font-medium gap-2 flex items-center'>
//                 <CiClock2 />
//                 <span> 2 hours ago</span>
//               </section>
//               <section>
//                 <Button
//                   onClick={() => {
//                     history.push("/admin");
//                   }}
//                   className="col-span-1 !h-10 text-[#1D1D1F99] text-sm font-medium !bg-[#D8D8D8]"
//                 >
//                   <FaHeadphonesAlt className='text-xl' />

//                   play
//                 </Button>

//               </section>
//             </section>
//             <section className='flex flex-col mt-[24px]'>
//               <section className='flex items-center justify-between mb-[24px] '>
//                 <section className='text-[#1D1D1F99] text-2xl font-bold'>
//                   <text>What to Know</text>
//                 </section>
//                 <section className='flex items-center text-[#1D1D1F99] text-2xl font-semibold justify-between gap-2 mt-4'>
//                   <section>
//                     <text> <CiClock2 /></text>
//                   </section>
//                   <section>
//                     <text> (1-2min)</text>
//                   </section>
//                 </section>
//               </section>

//               <section className='text-[#1D1D1F99] text-xl font-medium'>
//                 <text>
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam

//                 </text>
//               </section>
//             </section>
//             <section className='flex flex-col mt-[24px]'>
//               <section className='flex items-center justify-between mb-[24px] '>
//                 <section className='text-[#1D1D1F99] text-2xl font-bold'>
//                   <text>What to Know</text>
//                 </section>
//                 <section className='flex items-center text-[#1D1D1F99] text-2xl font-semibold justify-between gap-2 mt-4'>
//                   <section>
//                     <text> <CiClock2 /></text>
//                   </section>
//                   <section>
//                     <text> (1-2min)</text>
//                   </section>
//                 </section>
//               </section>

//               <section className='text-[#1D1D1F99] text-xl font-medium'>
//                 <text>
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam

//                 </text>
//               </section>
//             </section>
            

//             <section className='flex flex-col '>
//               <LibraryInput
//                 placeholder="Enter Prompt..."
//                 onChangeValue={handleInputChange}
//                 onSubmitValue={handleSubmitValue}
//                 onFileUpload={handleFileUpload}
//               />

//             </section>
//           </div>
//         </div>
//         <div className="bg-white col-span-12 md:col-span-3 p-4">
//           <Card />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LibraryTopicDetails;


import React, { useState } from 'react';
import Button from '../../../components/small/Button';
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FaHeadphonesAlt } from "react-icons/fa";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import LibraryInput from '../../user/library/components/LibraryInput';
import Card from './components/Card';

const LibraryTopicDetails = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (value) => setInputValue(value);
  const handleSubmitValue = (value) => {
    alert(`Submitted Value: ${value}`);
    setInputValue('');
  };
  
  const handleFileUpload = (file) => {
    console.log("Uploaded File:", file.name);
    alert(`File Uploaded: ${file.name}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-1">
        <div className="col-span-12 md:col-span-9 p-4 text-white">
          <section>
            <Button
              onClick={() => history.push("/admin")}
              className="col-span-1 !h-9 !rounded-xl !p-4 text-[#1D1D1F99] !py-0 !bg-[#ACACAC]"
            >
              <IoReturnUpBackOutline className='text-xl' /> Back
            </Button>
          </section>
          <div className="bg-white border mt-5 shadow-[#8484850A] rounded-lg p-4 text-black">
            <section className="flex flex-col gap-4">
              <h1 className="text-3xl text-[#1D1D1F99] font-bold">Library Topic Details</h1>
              <section className="text-[#1D1D1F99] text-sm font-medium">
                <p>Related Topics</p>
                <p className="text-[#1D1D1F99] text-sm font-medium">(Source: Journal of Nutrition)</p>
                <section className="flex items-center gap-2">
                  <CiCalendarDate />
                  <span>13 January, 2025</span>
                </section>
              </section>
            </section>

            <section className="flex items-center justify-between gap-4">
              <section className="text-[#1D1D1F99] text-sm font-medium gap-2 flex items-center">
                <CiClock2 />
                <span>2 hours ago</span>
              </section>
              <section>
                <Button
                  onClick={() => history.push("/admin")}
                  className="col-span-1 !h-10 text-[#1D1D1F99] text-sm font-medium !bg-[#D8D8D8]"
                >
                  <FaHeadphonesAlt className='text-xl' /> Play
                </Button>
              </section>
            </section>

            <section className="flex flex-col mt-[24px]">
              <section className="flex items-center justify-between mb-[24px]">
                <section className="text-[#1D1D1F99] text-2xl font-bold">What to Know</section>
                <section className="flex items-center text-[#1D1D1F99] text-2xl font-semibold gap-2 mt-4">
                  <CiClock2 />
                  <span>(1-2min)</span>
                </section>
              </section>

              <section className="text-[#1D1D1F99] text-xl font-medium">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam...</p>
              </section>
            </section>

            <section className="flex flex-col mt-[24px]">
              <section className="flex items-center justify-between mb-[24px]">
                <section className="text-[#1D1D1F99] text-2xl font-bold">What to Know</section>
                <section className="flex items-center text-[#1D1D1F99] text-2xl font-semibold gap-2 mt-4">
                  <CiClock2 />
                  <span>(1-2min)</span>
                </section>
              </section>

              <section className="text-[#1D1D1F99] text-xl font-medium">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam...</p>
              </section>
            </section>

            <section className="flex flex-col">
              <LibraryInput
                placeholder="Enter Prompt..."
                onChangeValue={handleInputChange}
                onSubmitValue={handleSubmitValue}
                onFileUpload={handleFileUpload}
              />
            </section>
          </div>
        </div>

        <div className="bg-white col-span-12 md:col-span-3 p-4">
          <Card />
        </div>
      </div>
    </div>
  );
};

export default LibraryTopicDetails;
