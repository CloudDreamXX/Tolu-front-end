import { useState, useEffect } from "react";
import { FaRegFolder } from "react-icons/fa";
import Button from "./small/Button";
// import { Button } from "@/components/ui/button";

// Function to process folders
function extractFolderData(folder) {
    return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        creator_id: folder.creator_id,
        created_at: folder.created_at,
    };
}

function processFolders(folderList, result = []) {
    if (!Array.isArray(folderList)) {
        console.error("Invalid input: folderList is not an array", folderList);
        return result;
    }

    folderList.forEach((folder) => {
        result.push(extractFolderData(folder));

        if (folder.subfolders && Array.isArray(folder.subfolders)) {
            processFolders(folder.subfolders, result);
        }
    });

    return result;
}

function getAllFolders(folderList) {
    return processFolders(folderList, []);
}

// **Folder Selection Component**
export default function FolderSelection({ folders, setSelectedFolder, selectedFolder, closeModal, handleMoveContent, isMoving }) {
    const [allFolders, setAllFolders] = useState([]);
    //   const [selectedFolder, setSelectedFolder] = useState(null);
console.log("folders", folders)
    useEffect(() => {
        if (folders) {
            setAllFolders(getAllFolders(folders));
        }
    }, [folders]);

    return (
        <div>
            <p className="mb-3">Please select a folder</p>
            {allFolders.map((item) => (
                <div
                    key={item.id}
                    onClick={() => setSelectedFolder(item.id)}
                    className={`flex cursor-pointer hover:bg-gray-200 mt-3 items-center gap-2 p-2 rounded-lg ${selectedFolder === item.id ? "bg-primary text-white" : "bg-gray-100"
                        }`}
                >
                    <FaRegFolder /> {item.name}
                </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
                <Button className="bg-gray-400 text-white" text="Close" onClick={closeModal} />
                <Button
                    className="bg-blue-500 text-white"
                    text="Move"
                    disabled={!selectedFolder || isMoving}
                    onClick={handleMoveContent}
                />
            </div>
        </div>
    );
}
