import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAddFolderData, setDetailResponse } from "../../../../redux/slice/sidebarSlice";
import Folder from "./Folder";

const FolderTree = ({ allFolders, addArticlesHandler }) => {
    const [openFolders, setOpenFolders] = useState({}); // Store open folders per level
    const [activeContextMenu, setActiveContextMenu] = useState(null); // Track active context menu folder
    const [contextMenuPosition, setContextMenuPosition] = useState(null); // Track menu position
    const dispatch = useDispatch();

    // Toggle Folder Open/Close with Level-wise Behavior
    const toggleFolder = (id, level) => {
        setOpenFolders((prev) => ({
            ...prev,
            [level]: prev[level] === id ? null : id, // Toggle folder open/close
        }));
        dispatch(setAddFolderData({
            folderId: id,
            add: false
        }));
        dispatch(setDetailResponse(false));

    };

    return (
        <div className="p-1 custom-scroll rounded-lg">
            {allFolders?.posted_topics?.map((folder) => (
                <Folder
                    key={folder.id}
                    folder={folder}
                    openFolders={openFolders}
                    toggleFolder={toggleFolder}
                    addArticlesHandler={addArticlesHandler}
                    level={0} // Root level
                    activeContextMenu={activeContextMenu}
                    setActiveContextMenu={setActiveContextMenu}
                    contextMenuPosition={contextMenuPosition}
                    setContextMenuPosition={setContextMenuPosition}
                />
            ))}
        </div>
    );
};

export default FolderTree;
