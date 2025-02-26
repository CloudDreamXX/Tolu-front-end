import React, { useState } from 'react'
import Input from './small/Input'
import Button from './small/Button'
import { useEditContentByIdMutation } from '../redux/apis/apiSlice';
import toast from 'react-hot-toast';
function EditContent({ content, closeEditModalHandle }) {
    const [newTitle, setNewTitle] = useState(content.title);
    const [editContent] = useEditContentByIdMutation();
    console.log("newTitle", newTitle)
    console.log("content", content)
    const handleEditContent = async () => {
        if (!content?.id) {
            toast.error("No content selected!");
            return;
        }

        try {
            const response = await editContent({
                content_id: content?.id,
                new_title: newTitle.trim(), // Send plain text for title
                new_content: content.content, // Keep HTML for content
                new_query: content?.query, // Assuming query remains unchanged
            }).unwrap();

            toast.success(response.message || "Content updated successfully");
            closeEditModalHandle()
            // setIsEditing(false);
            // setIsEditModal(false);
        } catch (error) {
            console.error("Error updating content:", error);
            toast.error(error.message || "Failed to update content");
        }
    };

    return (
        <div className='w-full  flex-col h-full gap-4 flex items-center justify-center  p-4'>
            <section className='flex gap-4 w-full' >

                <Input type="text" placeholder="Enter new content"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && handleEditContent(content.id)
                      }
                />
            </section>
            <section className='flex gap-4' >

                <Button
                    className="bg-primary text-white"
                    text="Cancel"
                    // disabled={!selectedFolder || isMoving}
                    onClick={closeEditModalHandle}
                />
                <Button
                    className="bg-primary text-white"
                    text="Edit content"
                    // disabled={!selectedFolder || isMoving}
                    onClick={handleEditContent}
                />
            </section>
        </div>
    )
}

export default EditContent