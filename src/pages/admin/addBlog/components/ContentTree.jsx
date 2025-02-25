import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAddFolderData } from "../../../../redux/slice/sidebarSlice";
import Folder from "./Folder";
import Content from "./Content";

const ContentTree = ({ allFolders, addArticlesHandler }) => {
    const [openFolders, setOpenFolders] = useState({}); // Store open folders per level
    const [activeContextMenu, setActiveContextMenu] = useState(null); // Track active context menu folder
    const [contextMenuPosition, setContextMenuPosition] = useState(null); // Track menu position
    const dispatch = useDispatch();
    console.log("content", allFolders);
    // Toggle Folder Open/Close with Level-wise Behavior
    const toggleFolder = (id, level) => {
        console.log("level", level)

        setOpenFolders((prev) => ({
            ...prev,
            [level]: prev[level] === id ? null : id, // Toggle folder open/close
        }));
        // dispatch(setAddFolderData({
        //     folderId: id,
        //     add: false
        // }));
    };

    return (
        <div className="p-1 custom-scroll rounded-lg">
            {allFolders?.saved_topics?.map((folder) => (
                <Content
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

export default ContentTree;
