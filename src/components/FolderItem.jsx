import React from 'react'
import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaRegFolder } from "react-icons/fa";
import Modal from "./modals/Modal";
import { useGetFolderStructureQuery, useMoveContentMutation } from "../redux/apis/apiSlice";
import Button from "./small/Button";
import toast from "react-hot-toast";
function FolderItem({ content, onAdd, onDelete, setIsEditing }) {

    console.log("content", content)

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
            {/* Move Content Modal */}
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Move Content</h1>}>
        <p>Please select a folder:</p>
        {isLoading ? (
            <p>Loading folders...</p>
        ) : (
            folderList.map((folder) => (
                <div
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex gap-2 p-2 rounded-lg cursor-pointer ${selectedFolder === folder.id ? "bg-primary text-white" : "bg-white"}`}
                >
                    <FaRegFolder /> {folder.name}
                </div>
            ))
        )}
        <section className="flex justify-end gap-2 mt-4">
            <Button className="bg-gray-500 text-white" text="Close" onClick={closeModal} />
            <Button className="bg-blue-500 text-white" text="Move" disabled={!selectedFolder} onClick={handleMoveContent} />
        </section>
    </Modal> */}

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