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
import FolderSelection from "./FolderSelection";
import EditContent from "./EditContent";

const ContentItem = ({ content, folderId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editContent] = useEditContentByIdMutation();
  const [editModal, setEditModal] = useState(false);
  const [deleteContent] = useDeleteContentByIdMutation();
  const { data: allFolders, isLoading } = useGetFolderStructureQuery();
  const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Extract all folders recursively


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

  const handleDeleteContent = async () => {
    try {
      await deleteContent(content.id).unwrap();
      toast.success("Content deleted successfully.");
    } catch (error) {
      toast.error("Error deleting content.");
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFolder(null);
  };

  const closeEditModalHandle = () => setEditModal(false);

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

  const [searchParams, setSearchParams] = useSearchParams();
  const userType = localStorage.getItem("userType");
  const contentHandler = (item) => {
    dispatch(setContentId(item));

    if (currentPath === "/admin/library-topic-details") {
      setSearchParams({ id: item.id, folderId: folderId });
    } else if (currentPath === "/coaches/coaches-library-topic-details") {
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={<h1 className="text-xl font-bold">Move Content</h1>}
      >
        <FolderSelection
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={allFolders?.posted_topics}
          closeModal={closeModal}
          handleMoveContent={handleMoveContent}
          isMoving={isMoving}
        />
      </Modal>
      <Modal
        isOpen={editModal}
        onClose={closeEditModalHandle}
        title={<h1 className="text-xl font-bold">Edit Content</h1>}
      >
        <EditContent content={content} closeEditModalHandle={closeEditModalHandle} />
      </Modal>

      {/* Content Item */}
      <div className="flex items-center justify-between p-2 border-b border-gray-300 relative">


        <section className="truncate  w-28"
          onClick={() => contentHandler(content)}
        >
          <span className="">📄 {content.title}</span>
        </section>

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
                setEditModal(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Rename
            </button>
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
