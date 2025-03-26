import React from 'react';
import Button from '../../../../components/small/Button';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useUpdateFolderContentMutation } from '../../../../redux/apis/apiSlice';

function AddFiles({ setSelectedFile, selectedFile, fetchFile, folder }) {
  const [deleteFile, { isLoading, error }] = useUpdateFolderContentMutation();

  const deleteFileHandler = async (index) => {
    try {
      await deleteFile({
        folder_id: folder.id,
        files_to_delete: [index],
      }).unwrap();
      toast.success('File deleted successfully');
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFile((prevFiles) => [...prevFiles, ...files]);
    toast.success(
      `${files.length} File${files.length > 1 ? 's' : ''} Uploaded`
    );
  };

  const handleFileCardClick = () => {
    document.getElementById('file-input').click();
  };

  const removeFile = (indexToRemove) => {
    setSelectedFile((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <section className="flex flex-col p-4">
      <div className="flex justify-between mb-2 items-center text-xl font-bold text-black">
        <span>Files</span>
        <Button text="Upload" onClick={handleFileCardClick} />
      </div>
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <section className="flex flex-col gap-2">
        {selectedFile?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {selectedFile.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
        )}
        {fetchFile?.length > 0 && (
          <ul className=" space-y-2">
            {fetchFile.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span>{file.filename}</span>
                <button
                  onClick={() => deleteFileHandler(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={isLoading}
                >
                  <FaTimes />
                </button>
              </li>
            ))}
            {error && <p className="text-red-500">Error deleting file!</p>}
          </ul>
        )}
      </section>
    </section>
  );
}

export default AddFiles;
