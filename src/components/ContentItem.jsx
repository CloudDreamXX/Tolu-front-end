import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaEllipsisV, FaRegFolder } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  useDeleteContentByIdMutation,
  useEditContentByIdMutation,
  useGetFolderStructureQuery,
  useMoveContentMutation,
} from "../redux/apis/apiSlice";
import { setContentId } from "../redux/slice/sidebarSlice";
import Modal from "./modals/Modal";
import Button from "./small/Button";

const ContentItem = ({ content, folderId, onAdd, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(content.title);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);

  const { data: allFolders, isLoading } = useGetFolderStructureQuery();
  const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
  const [editContent] = useEditContentByIdMutation();
  const [deleteContent] = useDeleteContentByIdMutation();

  // Extract all folders recursively
  const getAllFolders = (data) => {
    let folders = [];
    const traverse = (foldersArray) => {
      foldersArray.forEach((folder) => {
        folders.push({ id: folder.id, name: folder.name });
        if (folder.subfolders?.length) traverse(folder.subfolders);
      });
    };
    if (data?.folders) traverse(data.folders);
    return folders;
  };
  const folderList = allFolders ? getAllFolders(allFolders) : [];

  // Move content to selected folder
  const handleMoveContent = async () => {
    if (!selectedFolder) return toast.error("Please select a folder.");
    if (content.current_folder_id === selectedFolder)
      return toast.error("Content is already in this folder.");

    try {
      const response = await moveContent({
        content_id: content.id,
        target_folder_id: selectedFolder,
      }).unwrap();
      toast.success(response.message);
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || "Error moving content.");
    }
  };

  // Edit content name
  const handleEditContent = async () => {
    try {
      const response = await editContent({
        contentId: content.id,
        newTitle: newName,
      }).unwrap();
      toast.success(response.message);
      setIsEditing(false);
    } catch (error) {
      toast.error("Error renaming content.");
    }
  };

  // Delete content
  const handleDeleteContent = async () => {
    try {
      await deleteContent(content.id).unwrap();
      toast.success("Content deleted successfully.");
      // onDelete(content);
    } catch (error) {
      toast.error("Error deleting content.");
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFolder(null);
  };

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  // const navigate = useNavigate();
  // const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = localStorage.getItem("userType");
  // const currentPath = location.pathname;
  const contentHandler = (item) => {
    dispatch(setContentId(item));

    if (currentPath === "/admin/library-topic-details") {
      // Update the query parameter instead of navigating
      setSearchParams({ id: item.id, folderId: folderId });
    } else if (currentPath === "/coaches/coaches-library-topic-details") {
      // Update the query parameter instead of navigating
      setSearchParams({ id: item.id, folderId: folderId });
    } else if (currentPath === "/admin") {
      navigate(
        `/admin/library-topic-details?id=${item.id}&folderId=${folderId}`
      );
    } else if (currentPath === "/coaches") {
      navigate(
        `/coaches/coaches-library-topic-details?id=${item.id}&folderId=${folderId}`
      );
    }
  };

  return (
    <>
      {/* Move Content Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={<h1 className="text-xl font-bold">Move Content</h1>}
      >
        <p className="mb-3">Please select a folder:</p>
        {folderList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedFolder(item.id)}
            className={`flex gap-2 p-2 rounded-lg ${
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
        </div>
      </Modal>

      {/* Content Item */}
      <div className="flex items-center justify-between p-2 border-b border-gray-300 relative">
        {isEditing ? (
          <input
            onBlur={() => handleEditContent(content.id)} // Pass content id on blur
            onKeyDown={(e) =>
              e.key === "Enter" && handleEditContent(content.id)
            } // Pass folder id on Enter key press
            ref={inputRef}
            className="w-36 border p-1"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        ) : (
          <section
            className="truncate  w-28"
            onClick={() => contentHandler(content)}
          >
            <span className="">📄 {content.title}</span>
          </section>
        )}

        {/* Dropdown Menu */}
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-2 top-8 bg-white shadow-lg border rounded-md w-32 z-10"
          >
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Move
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Rename
            </button>
            {/* <button onClick={() => { onAdd(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Add</button> */}
            <button
              onClick={() => {
                handleDeleteContent(), setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentItem;
