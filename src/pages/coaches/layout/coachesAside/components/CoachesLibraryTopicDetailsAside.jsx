import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

import { TfiWrite } from "react-icons/tfi";
import { useDispatch } from 'react-redux';
import { apiErrorHandler } from '../../../../../api/apiErrorHandler';
import useAutoRefetchOnReconnect from '../../../../../api/useAutoRefetchOnReconnect';
import { useGetFolderStructureQuery } from '../../../../../redux/apis/apiSlice';
import { setAddFolderData } from '../../../../../redux/slice/sidebarSlice';
import FolderTree from '../../../../admin/addBlog/components/FolderTree';
import ContentTree from '../../../../admin/addBlog/components/ContentTree';

function CoachesLibraryTopicDetailsAside() {






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

    const dispatch = useDispatch();

    const handleDropdownChange = (e) => {
        dispatch(setSidebarData(e.target.value));  // Update state
    };


    const addArticlesHandler = (event, id) => {
        event.stopPropagation(); // Stops the event from propagating to parent elements
        dispatch(setAddFolderData({ folderId: id, add: true })); // Assuming you want to set the selected folder ID here
        // Handle any other logic related to stopping pagination, etc.
    };

    return (
        <div className="flex flex-col  w-full  justify-between h-full">
            <div
                className={`flex flex-col h-full gap-2 overflow-hidden ${isAsideOpen ? "items-center" : "items-start"
                    }`}
            >
                {/* <div className="p-4 w-full">
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
                                <div className="dropdown-content  custom-scroll   overflow-auto">
                                    <FolderTree allFolders={allFolders} addArticlesHandler={addArticlesHandler} />



                                </div>
                                <div className="mt-4">
                                    <text className="text-sm font-semibold text-[#444444]">
                                        SAVED TOPICS
                                    </text>
                                    <ContentTree allFolders={allFolders} addArticlesHandler={addArticlesHandler} />

                                </div>
                            </>
                        )}
                    </div>
                </div> */}
                <div className="p-4 h-full overflow-auto w-full">
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
                    <div className="dropdown-content  custom-scroll   overflow-auto">
                      <FolderTree allFolders={allFolders} addArticlesHandler={addArticlesHandler} />



                    </div>
                    <div className="mt-4">
                      <text className="text-sm font-semibold text-[#444444]">
                        SAVED TOPICS
                      </text>
                      <ContentTree allFolders={allFolders} addArticlesHandler={addArticlesHandler} />

                    </div>
                  </>
                )}
              </div>
            </div>
            </div>
        </div>
    )
}

export default CoachesLibraryTopicDetailsAside