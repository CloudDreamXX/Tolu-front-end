import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { ArrowIcon } from '../../../../../assets/svgs/Icon';
import { TbLogout2 } from "react-icons/tb";

import { IoIosArrowDown } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { FaRegFolderOpen } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { HiDotsHorizontal } from "react-icons/hi";
// import { useDispatch } from "react-redux";
import Button from '../../../../../components/small/Button';
import { setSidebarData } from '../../../../../redux/slice/sidebarSlice';


function LibraryDashboardSideBar() {


    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showMore, setShowMore] = useState({});

    const projects = [
        { name: 'Project A', folders: ['Perimenopause and menopa... 1', 'Perimenopause and menopa... 2', 'Perimenopause and menopa... 3', 'Perimenopause and menopa... 4', 'Perimenopause and menopa... 5', 'Perimenopause and menopa... 6', 'Perimenopause and menopa... 7',] },
        // { name: 'Project B', folders: ['Folder 1', 'Folder 2'] },
    ];

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

    const addArticlesHandler = () => {
        dispatch(setSidebarData(true));  // Update with add functionality
    };


    return (


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
                                <text className="text-[#393838]">Feedback</text>
                            </div>
                            <div className="project-container">
                                <div className="project-name flex mb-4 justify-between items-center rounded-lg cursor-pointer p-2 hover:bg-[#E0E0E0] transition-all duration-300" onClick={handleDropdownToggle}>
                                    <span className="text-[#393838] text-sm font-semibold">Projects</span>
                                    <span className={`text-[#393838]  dropdown-icon transition-all duration-400 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
                                        <IoIosArrowDown />
                                    </span>
                                </div>
                                {showDropdown && (
                                    <>
                                        <div className="dropdown-content  h-[370px] overflow-auto">
                                            {projects.map((project, index) => (
                                                <div key={index} className="project-item  overflow-auto  text-[#393838]">
                                                    <div className="text-[#393838] folders">
                                                        {project.folders.slice(0, showMore[project.name] ? project.folders.length : 7).map((folder, folderIndex) => (
                                                            <div key={folderIndex} className="folder-item">
                                                                <div
                                                                    className={`text-[#393838] text-sm font-normal flex justify-between items-center rounded-lg p-4 h-[20px] w-full mb-2 folder-name ${selectedFolder === folder ? 'bg-[#ACACAC]' : ''
                                                                        }`}
                                                                    onClick={() => handleFolderClick(folder)}
                                                                >
                                                                    <div className="flex gap-2">
                                                                        <span className="text-[#393838] folder-icon">
                                                                            <FaRegFolderOpen />
                                                                        </span>
                                                                        <span className="text-[#393838] cursor-pointer truncate w-[150px]">{folder}</span>
                                                                    </div>
                                                                    <span className="plus-icon cursor-pointer"><AiOutlinePlus onClick={addArticlesHandler} /></span>
                                                                </div>
                                                                {selectedFolder === folder && (
                                                                    <div className="folder-content  overflow-auto  ml-4 ">
                                                                        <ul className="p-2 space-y-3">
                                                                            {/* <li className=" rounded-lg p-1 text-[#393838] text-sm font-semibold hover:bg-[#E0E0E0] transition-all duration-300">Brain Fog Post-Hysteron</li> */}
                                                                            <li className=" rounded-lg p-1 text-[#393838] text-sm font-semibold hover:bg-[#E0E0E0] transition-all duration-300">Brain Fog Post-Hysteron</li>
                                                                            <li className=" rounded-lg p-1 text-[#393838] text-sm font-semibold hover:bg-[#E0E0E0] transition-all duration-300">Brain Fog Post-Hysteron</li>
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {project.folders.length > 7 && !showMore[project.name] && (
                                                            <div className="text-[#393838] flex gap-2 items-center text-sm cursor-pointer" onClick={() => handleShowMoreToggle(project.name)}>
                                                                <HiDotsHorizontal className="text-2xl text-[#A4A4A4]" /> Show more
                                                            </div>
                                                        )}
                                                        {project.folders.length > 5 && showMore[project.name] && (
                                                            <div className="text-[#393838] flex gap-2 items-center text-sm cursor-pointer" onClick={() => handleShowMoreToggle(project.name)}>
                                                                <HiDotsHorizontal className="text-2xl text-[#A4A4A4]" /> Show less
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
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
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex mb-4 items-center justify-center ">
                        <Button className={" !bg-white !border-[1px] border-[#008FF633] shadow-[0px_4px_6px_#7090B01F]   text-[#ACACAC]"} text="Log Out" width="w-full" >
                            <TbLogout2 />
                        </Button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default LibraryDashboardSideBar