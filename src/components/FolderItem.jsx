import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV } from "react-icons/fa";
function FolderItem({ content, onAdd, onDelete, setIsEditing }) {


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);



    // Function to get all folders recursively



    // Open modal to move content
    const onMove = (item) => {
        setSelectedContent(item.id);
        setIsModalOpen(true);
    };

    // Handle moving content



    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const handleClickOutside = (event) => {
        if (
            menuRef.current && !menuRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)
        ) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);





    return (
        <>

            {/* Content Item */}
            <div className="flex items-center justify-between p-2  border-gray-300 relative">
                {/* <span className="truncate w-36">📄 {content.title}</span> */}
                <button ref={buttonRef} onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-800">
                    <FaEllipsisV />
                </button>

                {isMenuOpen && (
                    <div ref={menuRef} className="absolute right-2 top-8 bg-white shadow-lg border rounded-md w-36 z-10">
                        <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Edit</button>
                        <button onClick={() => { onAdd(content.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Add SubFolder</button>
                        <button onClick={() => { onDelete(content.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-600">Delete</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default FolderItem