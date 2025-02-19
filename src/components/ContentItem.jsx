// // import { useState, useRef, useEffect } from "react";
// // import { FaEllipsisV } from "react-icons/fa";
// // import Modal from "./modals/Modal";
// // import { useGetFolderStructureQuery, useMoveContentMutation } from "../redux/apis/apiSlice";
// // import { FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
// // import Button from "./small/Button";


// // const ContentItem = ({ content, onAdd, onDelete }) => {
// //     const [isMenuOpen, setIsMenuOpen] = useState(false);
// //     const [selectedFolder, setSelectedFolder] = useState();
// //     const menuRef = useRef(null);
// //     const buttonRef = useRef(null);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const { data: allFolders, isLoading, isError, error, isSuccess, refetch } = useGetFolderStructureQuery();
// //     const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
// //     const [selectedContent, setSelectedContent] = useState()
// //     function getAllFolders(data) {
// //         let folders = [];

// //         function traverse(foldersArray) {
// //             for (const folder of foldersArray) {
// //                 folders.push({
// //                     id: folder.id,
// //                     name: folder.name,
// //                     description: folder.description
// //                 });

// //                 if (folder.subfolders && folder.subfolders.length > 0) {
// //                     traverse(folder.subfolders);
// //                 }
// //             }
// //         }

// //         traverse(data.folders);
// //         return folders;
// //     }

// //     const result = getAllFolders(allFolders);
// //     console.log("all folder ", result);
// //     const moveContentSelectedFolder = (item) => {
// //         console.log("move content to folder ", item);
// //         setSelectedFolder(item)
// //     }
// //     const handleMoveContent = async () => {
// //         if (!selectedContent || !targetFolder) {
// //             setMessage({ type: 'error', text: 'Please select both content and target folder.' });
// //             return;
// //         }

// //         if (selectedContentFolder === targetFolder) {
// //             setMessage({ type: 'error', text: 'Content is already in the selected folder.' });
// //             return;
// //         }

// //         try {
// //             await moveContent({ content_id: selectedContent, target_folder_id: targetFolder }).unwrap();
// //             setMessage({ type: 'success', text: 'Content moved successfully!' });
// //             setSelectedContent('');
// //             setTargetFolder('');
// //         } catch (error) {
// //             setMessage({ type: 'error', text: error?.data?.message || 'Error moving content.' });
// //             console.error(error);
// //         }
// //     };
// //     const onMove = (item) => {
// //         setSelectedContent(item.id)
// //         // setIsModalOpen(true)
// //         openModal()
// //     }
// //     console.log("content id to move folder ", selectedContent);
// //     console.log("selected content to move selected folder", selectedFolder)
// //     const openModal = () => setIsModalOpen(true);
// //     const closeModal = () => {
// //         setIsModalOpen(false)
// //         setSelectedContent(null)
// //         setSelectedFolder(null)
// //     };



// //     const toggleMenu = () => {
// //         setIsMenuOpen((prev) => !prev);
// //     };

// //     const handleClickOutside = (event) => {
// //         if (
// //             menuRef.current && !menuRef.current.contains(event.target) &&
// //             buttonRef.current && !buttonRef.current.contains(event.target)
// //         ) {
// //             setIsMenuOpen(false);
// //         }
// //     };

// //     useEffect(() => {
// //         document.addEventListener("mousedown", handleClickOutside);
// //         return () => {
// //             document.removeEventListener("mousedown", handleClickOutside);
// //         };
// //     }, []);


// //     return (
// //         <>
// //             <Modal className={''} isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Content Move Folder</h1>}>
// //                 <span>Please select folder </span>
// //                 {result?.map((item) => (
// //                     <div key={item.id} onClick={() => moveContentSelectedFolder(item.id)} className={`flex gap-2 p-2 rounded-lg ${selectedFolder == item.id ? "bg-primary" : "bg-white"} `}>
// //                         <FaRegFolder />  {item?.name}
// //                     </div>
// //                 ))}
// //                 <section className="flex justify-end gap-2 mt-4">
// //                     <Button
// //                         className={"!bg-[#8E8E8E] text-white "}
// //                         text="Close"
// //                         onClick={closeModal}
// //                     />
// //                     <Button
// //                         className={"!bg-[#B6B6B6] text-[#1D1D1F99] "}
// //                         text="Move"
// //                         disabled={!selectedFolder}
// //                         onClick={handleMoveContent}
// //                     />
// //                 </section>
// //             </Modal>
// //             <div className="flex items-center justify-between p-2 border-b border-gray-300 relative">
// //                 <span className="truncate w-36">  📄{content.title}</span>
// //                 <button ref={buttonRef} onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-800">
// //                     <FaEllipsisV />
// //                 </button>
// //                 {isMenuOpen && (
// //                     <div ref={menuRef} className="absolute right-2 top-8 bg-white shadow-lg border rounded-md w-32 z-10">
// //                         <button onClick={() => { onMove(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Move</button>
// //                         <button onClick={() => { onAdd(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Add</button>
// //                         <button onClick={() => { onDelete(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-600">Delete</button>
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // };

// // export default ContentItem;

// import { useState, useRef, useEffect } from "react";
// import { FaEllipsisV, FaRegFolder } from "react-icons/fa";
// import Modal from "./modals/Modal";
// import { useDeleteContentByIdMutation, useEditContentByIdMutation, useGetFolderStructureQuery, useMoveContentMutation } from "../redux/apis/apiSlice";
// import Button from "./small/Button";
// import toast from "react-hot-toast";

// const ContentItem = ({ content, onAdd, onDelete, setMessage }) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [selectedFolder, setSelectedFolder] = useState(null);
//     const [selectedContent, setSelectedContent] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isContentEditing, setIsContentEditing] = useState(false)
//     const menuRef = useRef(null);
//     const buttonRef = useRef(null);
//     console.log("constent", content)
//     const { data: allFolders, isLoading } = useGetFolderStructureQuery();
//     const [moveContent, { isLoading: isMoving }] = useMoveContentMutation();
//     const [newName, setNewName] = useState(content.title);
//     const inputRef = useRef(null);
//     // Function to get all folders recursively
//     function getAllFolders(data) {
//         let folders = [];

//         function traverse(foldersArray) {
//             foldersArray.forEach((folder) => {
//                 folders.push({ id: folder.id, name: folder.name });
//                 if (folder.subfolders?.length) traverse(folder.subfolders);
//             });
//         }

//         if (data?.folders) traverse(data.folders);
//         return folders;
//     }

//     const folderList = allFolders ? getAllFolders(allFolders) : [];

//     // Open modal to move content
//     const onMove = (item) => {
//         setSelectedContent(item.id);
//         setIsModalOpen(true);
//     };

//     // Handle moving content
//     const handleMoveContent = async () => {
//         if (!selectedContent || !selectedFolder) {
//             setMessage({ type: "error", text: "Please select both content and target folder." });
//             return;
//         }

//         if (content.current_folder_id === selectedFolder) {
//             setMessage({ type: "error", text: "Content is already in the selected folder." });
//             return;
//         }

//         try {
//             const response = await moveContent({ content_id: selectedContent, target_folder_id: selectedFolder }).unwrap();
//             // setMessage({ type: "success", text: "Content moved successfully!" });
//             console.log("Content moved", response)
//             toast.success(response.message)
//             closeModal();
//         } catch (error) {
//             setMessage({ type: "error", text: error?.data?.message || "Error moving content." });
//             console.error(error);
//         }
//     };
//     const [editContent] = useEditContentByIdMutation();
//     const [deleteContent] = useDeleteContentByIdMutation();
//     const handleEditContent = async () => {
//         try {
//             // if (!content.id?.contentId) return;
//             const response = await editContent({ contentId: content.id, newTitle: newName }).unwrap();
//             toast.success(response.message);
//             console.log("Content renamed successfully", response);
//             // setTopicModalOpen(false)
//             setNewName(null)
//             // setIsEditing(false);
//         } catch (error) {
//             console.error("Error renaming content:", error);
//             toast.error(error.message);
//         }
//     };

//     const handleDeleteContent = async () => {
//         try {
//             // if (!content.id?.contentId) return;
//             const response = await deleteContent(content.id).unwrap();
//             toast.success(response.message);

//             console.log("Content deleted successfully");
//             setTopicModalOpen(false);
//         } catch (error) {
//             console.error("Error deleting content:", error);
//         }
//     };




//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedContent(null);
//         setSelectedFolder(null);
//     };

//     const toggleMenu = () => setIsMenuOpen((prev) => !prev);

//     const handleClickOutside = (event) => {
//         if (
//             menuRef.current && !menuRef.current.contains(event.target) &&
//             buttonRef.current && !buttonRef.current.contains(event.target)
//         ) {
//             setIsMenuOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <>
//             {/* Move Content Modal */}
//             <Modal isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Move Content</h1>}>
//                 <p>Please select a folder:</p>
//                 {isLoading ? (
//                     <p>Loading folders...</p>
//                 ) : (
//                     folderList.map((folder) => (
//                         <div
//                             key={folder.id}
//                             onClick={() => setSelectedFolder(folder.id)}
//                             className={`flex gap-2 p-2 rounded-lg cursor-pointer ${selectedFolder === folder.id ? "bg-primary text-white" : "bg-white"}`}
//                         >
//                             <FaRegFolder /> {folder.name}
//                         </div>
//                     ))
//                 )}
//                 <section className="flex justify-end gap-2 mt-4">
//                     <Button className="bg-gray-500 text-white" text="Close" onClick={closeModal} />
//                     <Button className="bg-blue-500 text-white" text="Move" disabled={!selectedFolder} onClick={handleMoveContent} />
//                 </section>
//             </Modal>

//             {/* Content Item */}
//             <div className="flex items-center justify-between p-2 border-b border-gray-300 relative">
//                 {isContentEditing ? (
//                     <input
//                         ref={inputRef}
//                         className="p-1 border rounded w-full"
//                         value={newName}
//                         onChange={(e) => setNewName(e.target.value)}
//                         onBlur={() => handleEditContent(content.id)} // Pass content id on blur
//                         onKeyDown={(e) => e.key === "Enter" && handleEditContent(content.id)} // Pass folder id on Enter key press
//                         autoFocus
//                     />
//                 ) : (
//                     <span className="truncate w-[100px]">{content.title}</span>
//                 )}
//                 {/* <span className="truncate w-36">📄 {content.title}</span> */}
//                 <button ref={buttonRef} onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-800">
//                     <FaEllipsisV />
//                 </button>

//                 {isMenuOpen && (
//                     <div ref={menuRef} className="absolute right-2 top-8 bg-white shadow-lg border rounded-md w-32 z-10">
//                         <button onClick={() => { onMove(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Move</button>
//                         <button onClick={() => { setIsContentEditing(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Edit</button>
//                         <button onClick={() => { handleDeleteContent(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-600">Delete</button>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default ContentItem;



import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaRegFolder } from "react-icons/fa";
import Modal from "./modals/Modal";
import { useDeleteContentByIdMutation, useEditContentByIdMutation, useGetFolderStructureQuery, useMoveContentMutation } from "../redux/apis/apiSlice";
import Button from "./small/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setContentId } from "../redux/slice/sidebarSlice";

const ContentItem = ({ content, onAdd, onDelete }) => {
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
        if (content.current_folder_id === selectedFolder) return toast.error("Content is already in this folder.");

        try {
            const response = await moveContent({ content_id: content.id, target_folder_id: selectedFolder }).unwrap();
            toast.success(response.message);
            closeModal();
        } catch (error) {
            toast.error(error?.data?.message || "Error moving content.");
        }
    };

    // Edit content name
    const handleEditContent = async () => {
        try {
            const response = await editContent({ contentId: content.id, newTitle: newName }).unwrap();
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
            if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const contentHandler = (item) => {
        console.log("Clicked on content item:", item);
        dispatch(setContentId(item));
    
        // Only navigate if the current path is different
        if (location.pathname !== "/admin/library-topic-details") {
            navigate(`/admin/library-topic-details`);
        }
    };

    return (
        <>
            {/* Move Content Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={<h1 className="text-xl font-bold">Move Content</h1>}>
                <p>Please select a folder:</p>
                {folderList.map((item) => (
                    <div key={item.id} onClick={() => setSelectedFolder(item.id)} className={`flex gap-2 p-2 rounded-lg ${selectedFolder === item.id ? "bg-primary text-white" : "bg-gray-100"}`}>
                        <FaRegFolder /> {item.name}
                    </div>
                ))}
                <div className="flex justify-end gap-2 mt-4">
                    <Button className="bg-gray-400 text-white" text="Close" onClick={closeModal} />
                    <Button className="bg-blue-500 text-white" text="Move" disabled={!selectedFolder || isMoving} onClick={handleMoveContent} />
                </div>
            </Modal>

            {/* Content Item */}
            <div className="flex items-center justify-between p-2 border-b border-gray-300 relative">
                {isEditing ? (
                    <input
                        onBlur={() => handleEditContent(content.id)} // Pass content id on blur
                        onKeyDown={(e) => e.key === "Enter" && handleEditContent(content.id)} // Pass folder id on Enter key press
                        ref={inputRef} className="w-36 border p-1" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                ) : (
                    <section className="truncate  w-28"  onClick={() => contentHandler(content)}>


                        <span className="">📄 {content.title}</span>
                    </section>
                )}

                {/* Dropdown Menu */}
                <button ref={buttonRef} onClick={() => setIsMenuOpen((prev) => !prev)} className="p-2 text-gray-600 hover:text-gray-800">
                    <FaEllipsisV />
                </button>
                {isMenuOpen && (
                    <div ref={menuRef} className="absolute right-2 top-8 bg-white shadow-lg border rounded-md w-32 z-10">
                        <button onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Move</button>
                        <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Rename</button>
                        {/* <button onClick={() => { onAdd(content); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Add</button> */}
                        <button onClick={() => { handleDeleteContent(), setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-red-200 text-red-600">Delete</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ContentItem;
