// // import { useState } from "react";
// // import Folder from "./Folder";
// // // import Folder from "./Folder"; // Import the Folder Component

// // const FolderTree = ({ allFolders, addArticlesHandler }) => {
// //   const [openFolders, setOpenFolders] = useState([]); // Track open folder IDs

// //   // Toggle Open/Close Folders
// //   const toggleFolder = (id) => {
// //     setOpenFolders((prev) =>
// //       prev.includes(id) ? prev.filter((folderId) => folderId !== id) : [...prev, id]
// //     );
// //   };

// //   return (
// //     <div className="h-[400px] overflow-auto custom-scroll shadow-md rounded-lg w-96">
// //       {allFolders.folders.map((folder) => (
// //         <Folder
// //           key={folder.id}
// //           folder={folder}
// //           openFolders={openFolders}
// //           toggleFolder={toggleFolder}
// //           addArticlesHandler={addArticlesHandler}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default FolderTree;

// import { useState } from "react";
// import Folder from "./Folder";
// import { useDispatch } from "react-redux";
// import { setAddFolderData } from "../../../../redux/slice/sidebarSlice";

// const FolderTree = ({ allFolders, addArticlesHandler }) => {
//     const [openFolders, setOpenFolders] = useState({}); // Store open folders per level
//     const dispatch = useDispatch();
//     // Toggle Folder Open/Close with Level-wise Behavior
//     const toggleFolder = (id, level) => {
//         console.log("toggleFolder called with id:", id, "and level:", level);
//         setOpenFolders((prev) => ({
//             ...prev,
//             [level]: prev[level] === id ? null : id, // If clicked again, close it; otherwise, open it
//         }));
//         // dispatch(setAddFolderData({ folderId: id || "d0dae127-e89e-4923-8bbd-d9c6416228e9", add: false }));
//         dispatch(setAddFolderData({
//             folderId: id ,
//             add: false
//         }));
//     };

//     return (
//         <div className="  p-1 custom-scroll   rounded-lg ">
//             {allFolders?.folders.map((folder) => (
//                 <Folder
//                     key={folder.id}
//                     folder={folder}
//                     openFolders={openFolders}
//                     toggleFolder={toggleFolder}
//                     addArticlesHandler={addArticlesHandler}
//                     level={0} // Root level
//                 />
//             ))}
//         </div>
//     );
// };

// export default FolderTree;
import { useState } from "react";
import Folder from "./Folder";
import { useDispatch } from "react-redux";
import { setAddFolderData } from "../../../../redux/slice/sidebarSlice";

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
    };

    return (
        <div className="p-1 custom-scroll rounded-lg">
            {allFolders?.folders.map((folder) => (
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
