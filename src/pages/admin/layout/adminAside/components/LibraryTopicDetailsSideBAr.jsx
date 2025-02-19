import { IoIosArrowDown } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import React, { useEffect, useState } from 'react';

import { TfiWrite } from "react-icons/tfi";
import { useDispatch } from 'react-redux';
import { ArrowIcon } from '../../../../../assets/svgs/Icon';
// import { useDispatch } from "react-redux";
import Button from '../../../../../components/small/Button';
// import { setAddFolderData, setSidebarData } from '../../../../../redux/slice/sidebarSlice';
import { useGetFolderStructureQuery } from '../../../../../redux/apis/apiSlice';
import { setAddFolderData } from '../../../../../redux/slice/sidebarSlice';
import FolderTree from '../../../addBlog/components/FolderTree';
import toast from 'react-hot-toast';
import { apiErrorHandler } from '../../../../../api/apiErrorHandler';
import useAutoRefetchOnReconnect from '../../../../../api/useAutoRefetchOnReconnect';


// Reusable Section Component
const SidebarSection = ({ Icon, text, onClick, extraClasses = "" }) => {
  return (
    <section
      onClick={onClick}
      className={`w-full text-black p-4 text-sm font-normal rounded-xl mt-2 hover:bg-[#ACACAC] flex items-center gap-2 cursor-pointer ${extraClasses}`}
    >
      <section>
        <Icon className='text-xl' />
      </section>
      <section>
        <text>{text}</text>
      </section>
    </section>
  );
};

function LibraryTopicDetailsSideBAr() {
  // const [isAsideOpen, setIsAsideOpen] = useState(false);
  // const [isHistory, setIsHistory] = useState(false);
  // const navigate = useNavigate(); // React Router navigate

  // const asideToggleHandler = () => {
  //   setIsAsideOpen(!isAsideOpen);
  //   setIsHistory(false); // Optionally reset history toggle on aside toggle
  // };

  // const showHistoryHandel = () => {
  //   setIsHistory(!isHistory);
  // };

  // // Navigation functions
  // const navigateTo = (path) => {
  //   navigate(path);
  // };


  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showMore, setShowMore] = useState({});
  const { data: allFolders, isLoading, isError, error, isSuccess, refetch } = useGetFolderStructureQuery();
  useEffect(() => {
    apiErrorHandler(isError, error, isSuccess, "Topic loaded successfully!");
  }, [isError, error, isSuccess]);
  useAutoRefetchOnReconnect(refetch);



  const asideToggleHandler = () => {
    setIsAsideOpen(!isAsideOpen);
    setShowDropdown(false);
    setSelectedFolder(null);
  };
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(selectedFolder === folder ? null : folder);
  };

  const handleShowMoreToggle = (projectName) => {
    setShowMore((prevState) => ({
      ...prevState,
      [projectName]: !prevState[projectName],
    }));
  };
  // const addArticlesHandler = () => {

  // }

  const dispatch = useDispatch();

  const handleDropdownChange = (e) => {
    dispatch(setSidebarData(e.target.value));  // Update state
  };

  // const addArticlesHandler = (id) => {
  //     console.log("id", id)
  //     dispatch(setSidebarData(true));  // Update with add functionality
  // };
  const addArticlesHandler = (event, id) => {
    console.log("addArticlesHandler", id)
    event.stopPropagation(); // Stops the event from propagating to parent elements
    dispatch(setAddFolderData({ folderId: id, add: true })); // Assuming you want to set the selected folder ID here
    // Handle any other logic related to stopping pagination, etc.
  };



  return (
    // <div
    //   className={`h-full border-[#008FF614] border-r-2 bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] 
    //     ${isAsideOpen ? "w-[90px]" : "w-[280px]"} shadow-md shadow-[#7090B024]`}
    // >
    //   <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
    //     <h6 className="text-3xl font-bold text-black">VITAI</h6>
    //   </div>
    //   <div
    //     className={`hidden xl:block absolute top-15 cursor-pointer transition-all duration-300 ${isAsideOpen ? "rotate-180 right-[-13%]" : "rotate-0 right-[-5%]"}`}
    //     onClick={asideToggleHandler}
    //   >
    //     <ArrowIcon />
    //   </div>

    //   {!isAsideOpen && (
    //     <section className="w-full flex flex-col p-4 items-center justify-center">
    //       <SidebarSection
    //         Icon={IoHomeOutline}
    //         text="Dashboard"
    //         onClick={() => navigateTo('/dashboard')}
    //       />
    //       <SidebarSection
    //         Icon={IoLibraryOutline}
    //         text="Library"
    //         onClick={() => navigateTo('/library')}
    //       />
    //       <SidebarSection
    //         Icon={CiShop}
    //         text="Health Shop"
    //         onClick={() => navigateTo('/health-shop')}
    //       />
    //       <SidebarSection
    //         Icon={LiaHistorySolid}
    //         text="History"
    //         onClick={showHistoryHandel}
    //       />
    //       {isHistory && (
    //         <>
    //           <SidebarSection
    //             Icon={MdHome}
    //             text="Homepage"
    //             onClick={() => navigateTo('/home')}
    //           />
    //           <SidebarSection
    //             Icon={IoLibrarySharp}
    //             text="Library"
    //             onClick={() => navigateTo('/library')}
    //           />
    //         </>
    //       )}
    //     </section>
    //   )}
    // </div>
    <div
      className={`h-full border-[#008FF614] border-r-2 bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] 
        ${isAsideOpen ? "w-[90px]" : "w-[280px]"} shadow-md shadow-[#7090B024]`}
    >
      <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
        <h6
          className="text-3xl font-bold text-black "
        >
          VITAI
        </h6>
      </div>
      <div
        className={`hidden xl:block absolute top-15 cursor-pointer transition-all duration-300 ${isAsideOpen ? "rotate-180 right-[-13%]" : "rotate-0 right-[-5%]"
          }`}
        onClick={asideToggleHandler}
      >
        <ArrowIcon />
      </div>
      {!isAsideOpen && (

        <div className="flex flex-col p-2 w-full  justify-between h-full">
          <div
            className={`flex flex-col   justify-center gap-2 overflow-hidden ${isAsideOpen ? "items-center" : "items-start"
              }`}
          >
            <div className="p-4 w-full">
              <div className="flex gap-2 mb-8 items-center ">
                <TfiWrite />
                <span className="text-[#393838]">Feedback</span>
              </div>
              <div className="project-container">
                <div className="project-name flex mb-4 justify-between items-center rounded-lg cursor-pointer p-2 hover:bg-[#E0E0E0] transition-all duration-300" onClick={handleDropdownToggle}>
                  <span className="text-[#393838] text-sm font-semibold">Topic</span>
                  <span className={`text-[#393838]  dropdown-icon transition-all duration-400 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
                    <IoIosArrowDown />
                  </span>
                </div>
                {showDropdown && (
                  <>
                    <div className="dropdown-content  h-[720px] custom-scroll   overflow-auto">
                      <FolderTree allFolders={allFolders} addArticlesHandler={addArticlesHandler} />



                    </div>
                    {/* <div className="mt-4">
                                            <text className="text-sm font-semibold text-[#444444]">
                                                Previous 7 Days
                                            </text>
                                            <div
                                                className={`text-[#393838] text-sm font-normal flex justify-between items-center rounded-lg p-4 h-[20px] w-full mb-2 folder-name 
                          }`}
                                                onClick={() => handleFolderClick(folder)}
                                            >
                                                <div className="flex gap-2">
                                                    <span className="text-[#393838] folder-icon">
                                                        <FaRegFolderOpen />
                                                    </span>
                                                    <span className="text-[#393838] truncate w-[100px]">Perimenopause and menopa...</span>
                                                </div>
                                                <span className="plus-icon cursor-pointer"><AiOutlinePlus onClick={addArticlesHandler} /></span>
                                            </div>
                                        </div> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LibraryTopicDetailsSideBAr;
