// // import { FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
// // import { AiOutlinePlus } from "react-icons/ai";

// // const Folder = ({ folder,
// //     openFolders,
// //     toggleFolder,
// //     addArticlesHandler,
// //     level,
// //     activeContextMenu,
// //     setActiveContextMenu,
// //     contextMenuPosition,
// //     setContextMenuPosition, }) => {
// //     const isOpen = openFolders[level] === folder.id;
// //     // console.log("folder", folder)
// //     // console.log("folderhugyghkugyttfgjhjk")
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [newName, setNewName] = useState(folder.name);
// //     const inputRef = useRef(null);


// //     const handleContextMenu = (event) => {
// //         event.preventDefault();

// //         // Close the previous context menu before opening a new one
// //         if (activeContextMenu && activeContextMenu !== folder.id) {
// //             setContextMenuPosition(null); // Close previous menu
// //         }

// //         // Set the position and active context menu for the current folder
// //         setContextMenuPosition({ x: event.pageX, y: event.pageY });
// //         setActiveContextMenu(folder.id); // Set current folder as the active one
// //     };

// //     // Handle edit folder name
// //     const handleEdit = async () => {

// //         if (newName.trim() !== folder.name) {
// //             try {
// //                 // Your edit folder API call here
// //                 console.log("Folder renamed successfully");
// //             } catch (error) {
// //                 console.error("Error renaming folder:", error);
// //             }
// //         }
// //         setIsEditing(false);
// //         setContextMenuPosition(null); // Close menu after edit
// //         setActiveContextMenu(null); // Reset active folder
// //     };

// //     // Handle delete folder
// //     const handleDelete = async () => {
// //         try {
// //             // Your delete folder API call here
// //             console.log("Folder deleted successfully");
// //         } catch (error) {
// //             console.error("Error deleting folder:", error);
// //         }
// //         setContextMenuPosition(null); // Close menu after delete
// //         setActiveContextMenu(null); // Reset active folder
// //     };

// //     // Close context menu when clicking outside
// //     const handleClickOutside = (event) => {
// //         if (!event.target.closest('.context-menu')) {
// //             setContextMenuPosition(null);
// //             setActiveContextMenu(null);
// //         }
// //     };

// //     // Attach the click outside event
// //     document.addEventListener("click", handleClickOutside);





// //     return (
// //         <div className=" relative">
// //             {/* Folder Name */}
// //             <div
// //                 className={`flex justify-between items-center cursor-pointer rounded-lg p-2 mb-2 ${isOpen ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 hover:bg-gray-400"
// //                     }`}
// //                 onContextMenu={handleContextMenu}
// //                 onClick={() => toggleFolder(folder.id, level)}
// //             >
// //                 <div className="flex gap-2 items-center">
// //                     {/* Folder Icon */}
// //                     <span className="text-gray-700">
// //                         {openFolders[level] === folder.id ? <FaRegFolderOpen /> : <FaRegFolder />}
// //                     </span>

// //                     {/* Editable Input Field */}
// //                     {isEditing ? (
// //                         <input
// //                             ref={inputRef}
// //                             className="p-1 border rounded w-full"
// //                             value={newName}
// //                             onChange={(e) => setNewName(e.target.value)}
// //                             onBlur={handleEdit}
// //                             onKeyDown={(e) => e.key === "Enter" && handleEdit()}
// //                             autoFocus
// //                         />
// //                     ) : (
// //                         <span className="truncate w-[100px]">{folder.name}</span>
// //                     )}
// //                 </div>
// //                 {/* Add Content Button */}
// //                 <span className="cursor-pointer">
// //                     <AiOutlinePlus onClick={(event) => addArticlesHandler(event, folder.id)} />
// //                 </span>
// //             </div>


// //             {contextMenuPosition && activeContextMenu === folder.id && (
// //                 <div
// //                     className="fixed z-20 context-menu bg-white shadow-md border rounded-lg p-2 text-sm space-y-2"
// //                     style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
// //                 >
// //                     <div
// //                         className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
// //                         onClick={() => {
// //                             setIsEditing(true);
// //                             setTimeout(() => inputRef.current?.focus(), 0);
// //                         }}
// //                     >
// //                         <FiEdit className="text-blue-600" />
// //                         Edit
// //                     </div>
// //                     <div
// //                         className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
// //                         onClick={handleDelete}
// //                     >
// //                         <FiTrash2 className="text-red-600" />
// //                         Delete
// //                     </div>
// //                 </div>
// //             )}


// //             {/* Render Subfolders & Files (If Open) */}
// //             {isOpen && (

// //                 <div className="ml-2 border-l-2 border-gray-300 pl-2">
// //                     {/* Check if there are no subfolders and no content */}
// //                     {(!folder.subfolders?.length && !folder.content?.length) ? (
// //                         <div className="ml-6 text-gray-500 text-sm">No data available</div>
// //                     ) : (
// //                         <>
// //                             {/* Render Subfolders */}
// //                             {folder.subfolders?.map((subfolder) => (
// //                                 <Folder
// //                                     key={subfolder.id}
// //                                     folder={subfolder}
// //                                     openFolders={openFolders}
// //                                     toggleFolder={toggleFolder}
// //                                     addArticlesHandler={addArticlesHandler}
// //                                     level={level + 1} // Increase level for nested folders
// //                                 />
// //                             ))}

// //                             {/* Render Files Inside Folder */}
// //                             {folder.content?.map((file, index) => (
// //                                 <div key={index} className="ml-6 text-gray-700 text-sm">
// //                                     📄 {file.title}
// //                                 </div>
// //                             ))}
// //                         </>
// //                     )}
// //                 </div>

// //             )}
// //         </div>
// //     );
// // };

// // export default Folder;
// import { FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
// import { AiOutlinePlus } from "react-icons/ai";
// import { useState, useRef, useEffect } from "react";
// import { FiEdit, FiTrash2 } from "react-icons/fi";

// const Folder = ({
//   folder,
//   openFolders,
//   toggleFolder,
//   addArticlesHandler,
//   level,
//   activeContextMenu,
//   setActiveContextMenu,
//   contextMenuPosition,
//   setContextMenuPosition,
// }) => {
//   const isOpen = openFolders[level] === folder.id;
//   const [isEditing, setIsEditing] = useState(false);
//   const [newName, setNewName] = useState(folder.name);
//   const inputRef = useRef(null);

//   // Ensure the context menu closes when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.context-menu')) {
//         setContextMenuPosition(null);
//         setActiveContextMenu(null);
//       }
//     };

//     // Attach click outside event listener
//     document.addEventListener("click", handleClickOutside);

//     // Cleanup event listener when component unmounts
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [setContextMenuPosition, setActiveContextMenu]);

//   const handleContextMenu = (event) => {
//     event.preventDefault();

//     // Close the previous context menu before opening a new one
//     if (activeContextMenu && activeContextMenu !== folder.id) {
//       setContextMenuPosition(null); // Close previous menu
//     }

//     // Set the position and active context menu for the current folder
//     setContextMenuPosition({ x: event.pageX, y: event.pageY });
//     setActiveContextMenu(folder.id); // Set current folder as the active one
//   };

//   // Handle edit folder name
//   const handleEdit = async () => {
//     if (newName.trim() !== folder.name) {
//       try {
//         // Your edit folder API call here
//         console.log("Folder renamed successfully");
//       } catch (error) {
//         console.error("Error renaming folder:", error);
//       }
//     }
//     setIsEditing(false);
//     setContextMenuPosition(null); // Close menu after edit
//     setActiveContextMenu(null); // Reset active folder
//   };

//   // Handle delete folder
//   const handleDelete = async () => {
//     try {
//       // Your delete folder API call here
//       console.log("Folder deleted successfully");
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//     }
//     setContextMenuPosition(null); // Close menu after delete
//     setActiveContextMenu(null); // Reset active folder
//   };

//   return (
//     <div className="relative">
//       {/* Folder Name */}
//       <div
//         className={`flex justify-between items-center cursor-pointer rounded-lg p-2 mb-2 ${
//           isOpen ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 hover:bg-gray-400"
//         }`}
//         onContextMenu={handleContextMenu}
//         onClick={() => toggleFolder(folder.id, level)}
//       >
//         <div className="flex gap-2 items-center">
//           {/* Folder Icon */}
//           <span className="text-gray-700">
//             {isOpen ? <FaRegFolderOpen /> : <FaRegFolder />}
//           </span>

//           {/* Editable Input Field */}
//           {isEditing ? (
//             <input
//               ref={inputRef}
//               className="p-1 border rounded w-full"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               onBlur={handleEdit}
//               onKeyDown={(e) => e.key === "Enter" && handleEdit()}
//               autoFocus
//             />
//           ) : (
//             <span className="truncate w-[100px]">{folder.name}</span>
//           )}
//         </div>
//         {/* Add Content Button */}
//         <span className="cursor-pointer">
//           <AiOutlinePlus onClick={(event) => addArticlesHandler(event, folder.id)} />
//         </span>
//       </div>

//       {/* Context Menu */}
//       {contextMenuPosition && activeContextMenu === folder.id && (
//         <div
//           className="fixed z-20 context-menu bg-white shadow-md border rounded-lg p-2 text-sm space-y-2"
//           style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
//         >
//           <div
//             className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
//             onClick={() => {
//               setIsEditing(true);
//               setTimeout(() => inputRef.current?.focus(), 0);
//             }}
//           >
//             <FiEdit className="text-blue-600" />
//             Edit
//           </div>
//           <div
//             className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
//             onClick={handleDelete}
//           >
//             <FiTrash2 className="text-red-600" />
//             Delete
//           </div>
//         </div>
//       )}

//       {/* Render Subfolders & Files (If Open) */}
//       {isOpen && (
//         <div className="ml-2 border-l-2 border-gray-300 pl-2">
//           {(!folder.subfolders?.length && !folder.content?.length) ? (
//             <div className="ml-6 text-gray-500 text-sm">No data available</div>
//           ) : (
//             <>
//               {/* Render Subfolders */}
//               {folder.subfolders?.map((subfolder) => (
//                 <Folder
//                   key={subfolder.id}
//                   folder={subfolder}
//                   openFolders={openFolders}
//                   toggleFolder={toggleFolder}
//                   addArticlesHandler={addArticlesHandler}
//                   level={level + 1} // Increase level for nested folders
//                   activeContextMenu={activeContextMenu}
//                   setActiveContextMenu={setActiveContextMenu}
//                   contextMenuPosition={contextMenuPosition}
//                   setContextMenuPosition={setContextMenuPosition}
//                 />
//               ))}

//               {/* Render Files Inside Folder */}
//               {folder.content?.map((file, index) => (
//                 <div key={index} className="ml-6 text-gray-700 text-sm">
//                   📄 {file.title}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Folder;
import { FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDeleteFolderByIdMutation, useEditFolderByIdMutation } from "../../../../redux/apis/apiSlice";

const Folder = ({
    folder,
    openFolders,
    toggleFolder,
    addArticlesHandler,
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

    // Ensure the context menu closes when clicking outside
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
        console.log("edit folder id", folderId);
        if (newName.trim() !== folder.name) {
            // try {
            //     // Call the passed editFolderHandler with the folderId
            //     editFolderHandler(folderId, newName);
            //     console.log("Folder renamed successfully");
            // } catch (error) {
            //     console.error("Error renaming folder:", error);
            // }
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
        console.log("delete folder id", folderId);

        // try {
        //     // Call the passed deleteFolderHandler with the folderId
        //     deleteFolderHandler(folderId);
        //     console.log("Folder deleted successfully");
        // } catch (error) {
        //     console.error("Error deleting folder:", error);
        // }
        try {
            await deleteFolder(folderId).unwrap();
            console.log("Folder deleted successfully");
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
        setContextMenuPosition(null); // Close menu after delete
        setActiveContextMenu(null); // Reset active folder
    };

    
    const contentHandler = (item) => {
        console.log("Clicked on content item:", item);
    }


    return (
        <div className="relative">
            {/* Folder Name */}
            <div
                className={`flex justify-between items-center cursor-pointer rounded-lg p-2 mb-2 ${isOpen ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 hover:bg-gray-400"
                    }`}
                onContextMenu={handleContextMenu}
                onClick={() => toggleFolder(folder.id, level)}
            >
                <div className="flex gap-2 items-center">
                    {/* Folder Icon */}
                    <span className="text-gray-700">
                        {isOpen ? <FaRegFolderOpen /> : <FaRegFolder />}
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
                {/* Add Content Button */}
                <span className="cursor-pointer">
                    <AiOutlinePlus onClick={(event) => addArticlesHandler(event, folder.id)} />
                </span>
            </div>

            {/* Context Menu */}
            {contextMenuPosition && activeContextMenu === folder.id && (
                <div
                    className="fixed z-20 context-menu bg-white shadow-md border rounded-lg p-2 text-sm space-y-2"
                    style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                >
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
                        onClick={() => {
                            setIsEditing(true);
                            setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                    >
                        <FiEdit className="text-blue-600" />
                        Edit
                    </div>
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
                        onClick={() => handleDelete(folder.id)} // Pass folder id to delete handler
                    >
                        <FiTrash2 className="text-red-600" />
                        Delete
                    </div>
                </div>
            )}

            {/* Render Subfolders & Files (If Open) */}
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
                            {folder.content?.map((file, index) => (
                                <div key={index} className="ml-6 truncate w-[100px] cursor-pointer hover:bg-gray-200 text-gray-700 text-sm">
                                    <section onClick={() => contentHandler(file.id)}>

                                        📄 {file.title}
                                    </section>
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
