import { useEffect, useRef, useState } from "react";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentItem from "../../../../components/ContentItem";
import FolderItem from "../../../../components/FolderItem";
import { useDeleteFolderByIdMutation, useEditFolderByIdMutation } from "../../../../redux/apis/apiSlice";
import { setAddFolderData, setContentId, setDetailResponse } from "../../../../redux/slice/sidebarSlice";

const Folder = ({
    folder,
    openFolders,
    toggleFolder,
    level,
    activeContextMenu,
    setActiveContextMenu,
    contextMenuPosition,
    setContextMenuPosition,
    editFolderHandler,
    deleteFolderHandler
}) => {
    const isOpen = openFolders[level] === folder.id;
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(folder.name);
    const inputRef = useRef(null);

    const addArticlesHandler = (id) => {
        dispatch(setAddFolderData({ folderId: id, add: true })); // Assuming you want to set the selected folder ID here
        dispatch(setDetailResponse(false));
    };
    const addNewFolderState = useSelector((state) => state.sidebar.addFolder);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.context-menu')) {
                setContextMenuPosition(null);
                setActiveContextMenu(null);
            }
        };

        // Attach click outside event listener
        document.addEventListener("click", handleClickOutside);

        // Cleanup event listener when component unmounts
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setContextMenuPosition, setActiveContextMenu]);

    const handleContextMenu = (event) => {
        event.preventDefault();

        // Close the previous context menu before opening a new one
        if (activeContextMenu && activeContextMenu !== folder.id) {
            setContextMenuPosition(null); // Close previous menu
        }

        // Set the position and active context menu for the current folder
        setContextMenuPosition({ x: event.pageX, y: event.pageY });
        setActiveContextMenu(folder.id); // Set current folder as the active one
    };
    const [editFolder] = useEditFolderByIdMutation();
    const [deleteFolder] = useDeleteFolderByIdMutation();
    // Handle edit folder name
    const handleEdit = async (folderId) => {
        if (newName.trim() !== folder.name) {

            try {
                await editFolder({ folderId, newName }).unwrap();
                console.log("Folder renamed successfully");
            } catch (error) {
                console.error("Error renaming folder:", error);
            }
        }
        setIsEditing(false);
        setContextMenuPosition(null); // Close menu after edit
        setActiveContextMenu(null); // Reset active folder
    };

    // Handle delete folder
    const handleDelete = async (folderId) => {
        try {
            await deleteFolder(folderId).unwrap();
            console.log("Folder deleted successfully");
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
        setContextMenuPosition(null); // Close menu after delete
        setActiveContextMenu(null); // Reset active folder
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const contentHandler = (item) => {
        dispatch(setContentId(item));
        navigate(`/admin/library-topic-details`);


    }
    const contentId = useSelector((state) => state.sidebar.contentId);

    const folderColorById = useSelector((state) =>
        state.folderColor.folderColors.find((f) => f.folderId === folder?.id)
    );

    // Use the folder's iconColor if found, otherwise fallback to a default color
   const iconColor = folderColorById ? folderColorById.iconColor : "#000000";

    return (
        <div className="relative">
            {/* Folder Name */}
            <div
                className={`flex justify-between items-center cursor-pointer rounded-lg pl-2 mb-2 ${isOpen ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 hover:bg-gray-400"
                    }`}
            >
                <div onClick={() => toggleFolder(folder.id, level)} className="flex gap-2 w-full p-2  items-center">
                    {/* Folder Icon */}
                    <span className="text-iconColor"
                    style={{ color: iconColor }}
                    >
                        {isOpen ? (
                            <FaRegFolderOpen className="text-iconColor" />
                        ) : (
                            <FaRegFolder className="text-iconColor" />
                        )}
                    </span>

                    {/* Editable Input Field */}
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            className="p-1 border rounded w-full"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={() => handleEdit(folder.id)} // Pass folder id on blur
                            onKeyDown={(e) => e.key === "Enter" && handleEdit(folder.id)} // Pass folder id on Enter key press
                            autoFocus
                        />
                    ) : (
                        <span className="truncate w-[100px]">{folder.name}</span>
                    )}
                </div>
                <FolderItem content={folder} onDelete={handleDelete} onAdd={addArticlesHandler} setIsEditing={setIsEditing} />

            </div>

            {isOpen && (
                <div className="ml-2 border-l-2 border-gray-300 pl-2">
                    {(!folder.subfolders?.length && !folder.content?.length) ? (
                        <div className="ml-6 text-gray-500 text-sm">No data available</div>
                    ) : (
                        <>
                            {/* Render Subfolders */}
                            {folder.subfolders?.map((subfolder) => (
                                <Folder
                                    key={subfolder.id}
                                    folder={subfolder}
                                    openFolders={openFolders}
                                    toggleFolder={toggleFolder}
                                    addArticlesHandler={addArticlesHandler}
                                    level={level + 1} // Increase level for nested folders
                                    activeContextMenu={activeContextMenu}
                                    setActiveContextMenu={setActiveContextMenu}
                                    contextMenuPosition={contextMenuPosition}
                                    setContextMenuPosition={setContextMenuPosition}
                                    editFolderHandler={editFolderHandler}
                                    deleteFolderHandler={deleteFolderHandler}
                                />
                            ))}

                            {/* Render Files Inside Folder */}
                            {folder.content?.map((content, index) => (
                                <div key={index} className="ml-6  w-40 cursor-pointer hover:bg-gray-200 text-gray-700 text-sm">
                                    <ContentItem content={content} folderId={folder.id} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Folder;
