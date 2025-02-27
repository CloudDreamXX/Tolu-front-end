import React, { useState } from 'react'
import Input from './small/Input'
import Button from './small/Button'
import { useEditFolderByIdMutation } from '../redux/apis/apiSlice';
import toast from 'react-hot-toast';

function EditFolder({ folder, closeEditFolderModal }) {
    const [newTitle, setNewTitle] = useState(folder?.name);
    const [editFolder] = useEditFolderByIdMutation();
    // console.log("folder", folder)


    const handleEditFolder = async () => {
        // if (newTitle.trim() !== folder.name) {
        console.log("yes")
        // try {
        //     const res = await editFolder({ folderId: folder?.id, newName: newTitle }).unwrap();
        //     toast.success(res.message)
        //     closeEditFolderModal()
        // } catch (error) {
        //     console.error("Error renaming folder:", error);
        // }
        // }
        // setIsEditing(false);
        // setContextMenuPosition(null); // Close menu after edit
        // setActiveContextMenu(null); // Reset active folder
    };

    return (
        <div className='w-full  flex-col h-full gap-4 flex items-center justify-center  p-4'>
            <section className='flex gap-4 w-full' >

                <Input type="text" placeholder="Enter new Name"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && handleEditContent()
                    }

                />
            </section>
            <section className='flex gap-4' >

                <Button
                    className="bg-primary text-white"
                    text="Cancel"
                    // disabled={!selectedFolder || isMoving}
                    onClick={closeEditFolderModal}
                />
                <Button
                    className="bg-primary text-white"
                    text="Edit Name"
                    // disabled={!selectedFolder || isMoving}
                    onClick={handleEditFolder}
                />
            </section>
        </div>
    )
}

export default EditFolder