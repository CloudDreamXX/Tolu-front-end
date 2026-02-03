import {
  useAddHealthHistoryNoteMutation,
  useDeleteHealthHistoryNoteMutation,
  useUpdateHealthHistoryNoteMutation,
} from "entities/coach";
import { useState, useEffect } from "react";
import { Textarea, Button } from "shared/ui";

type CoachNoteProps = {
  clientId: string;
  healthHistoryId?: string;
  blockName: string;
  initialValue?: string;
  noteId?: string;
};

export const CoachBlockNote = ({
  clientId,
  healthHistoryId,
  blockName,
  noteId,
  initialValue = "",
}: CoachNoteProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(!noteId);

  const [addNote, { isLoading: isAdding }] = useAddHealthHistoryNoteMutation();
  const [updateNote, { isLoading: isUpdating }] =
    useUpdateHealthHistoryNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] =
    useDeleteHealthHistoryNoteMutation();

  useEffect(() => {
    setValue(initialValue);
    setIsEditing(!noteId);
  }, [initialValue, noteId]);

  if (!healthHistoryId) return null;

  const isLoading = isAdding || isUpdating || isDeleting;
  const hasNote = Boolean(noteId);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (hasNote) {
      await updateNote({
        clientId,
        healthHistoryId,
        noteId: noteId!,
        noteContent: trimmed,
      }).unwrap();
    } else {
      await addNote({
        clientId,
        healthHistoryId,
        blockName,
        noteContent: trimmed,
      }).unwrap();
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!noteId) return;

    await deleteNote({
      clientId,
      healthHistoryId,
      noteId,
    }).unwrap();

    setValue("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-1">Coach note</p>

      <Textarea
        containerClassName="w-full min-h-[80px] rounded-md border p-2 text-sm"
        className="xl:text-sm"
        placeholder="Add your private note for this section..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={(hasNote && !isEditing) || isLoading}
      />

      <div className="mt-2 flex gap-2 w-full">
        {!hasNote && (
          <Button
            size="sm"
            variant={"brightblue"}
            onClick={handleSave}
            disabled={isLoading || !value.trim()}
          >
            Save
          </Button>
        )}

        {hasNote && !isEditing && (
          <>
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </>
        )}

        {hasNote && isEditing && (
          <>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || !value.trim()}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
