// import { useState } from "react";
// import Folder from "./Folder";
// // import Folder from "./Folder"; // Import the Folder Component

// const FolderTree = ({ allFolders, addArticlesHandler }) => {
//   const [openFolders, setOpenFolders] = useState([]); // Track open folder IDs

//   // Toggle Open/Close Folders
//   const toggleFolder = (id) => {
//     setOpenFolders((prev) =>
//       prev.includes(id) ? prev.filter((folderId) => folderId !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="h-[400px] overflow-auto custom-scroll shadow-md rounded-lg w-96">
//       {allFolders.folders.map((folder) => (
//         <Folder
//           key={folder.id}
//           folder={folder}
//           openFolders={openFolders}
//           toggleFolder={toggleFolder}
//           addArticlesHandler={addArticlesHandler}
//         />
//       ))}
//     </div>
//   );
// };

// export default FolderTree;

import { useState } from "react";
import Folder from "./Folder";
import { useDispatch } from "react-redux";
import { setAddFolderData } from "../../../../redux/slice/sidebarSlice";

const FolderTree = ({ allFolders, addArticlesHandler }) => {
    const [openFolders, setOpenFolders] = useState({}); // Store open folders per level
    const dispatch = useDispatch();
    // Toggle Folder Open/Close with Level-wise Behavior
    const toggleFolder = (id, level) => {
        console.log("toggleFolder called with id:", id, "and level:", level);
        setOpenFolders((prev) => ({
            ...prev,
            [level]: prev[level] === id ? null : id, // If clicked again, close it; otherwise, open it
        }));
        dispatch(setAddFolderData({ folderId: id, add: false }));
    };

    return (
        <div className="h-[400px] overflow-auto p-4 custom-scroll bg-white shadow-md rounded-lg w-96">
            {allFolders.folders.map((folder) => (
                <Folder
                    key={folder.id}
                    folder={folder}
                    openFolders={openFolders}
                    toggleFolder={toggleFolder}
                    addArticlesHandler={addArticlesHandler}
                    level={0} // Root level
                />
            ))}
        </div>
    );
};

export default FolderTree;
