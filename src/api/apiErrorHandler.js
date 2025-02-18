// import { toast } from "react-toastify";

import toast from "react-hot-toast";

export const apiErrorHandler = (isError, error, isSuccess, successMessage = "Request successful!", refetch) => {
    if (isSuccess) {
        toast.success(successMessage);
    }

    if (isError) {
        console.error("API Error:", error);

        if (!navigator.onLine) {
            toast.error("No internet connection. Please check your network.");

            // Auto refetch when internet reconnects
            const handleOnline = () => {
                console.log("Internet reconnected! Refetching data...");
                toast.info("Internet reconnected! Fetching latest data...");
                refetch();
                window.removeEventListener("online", handleOnline);
            };

            window.addEventListener("online", handleOnline);
        } else if (error?.response?.status >= 500) {
            toast.error("Server error! Please try again later.");
        } else if (error?.response?.status === 404) {
            toast.error("Requested data not found.");
        } else if (error?.response?.status === 401) {
            toast.error("Unauthorized! Please log in again.");
        } else if (error?.response?.status === 400) {
            toast.error("Invalid request. Please check your input.");
        } else {
            toast.error(error?.message || "Something went wrong!");
        }
    }
};



// /// for add api
// import { useAddFolderMutation } from "../yourApiService";
// import { apiErrorHandler } from "../middleware/apiMiddleware";

// const AddFolderComponent = () => {
//     const [addFolder, { isLoading, isError, error, isSuccess }] = useAddFolderMutation();

//     // Apply middleware
//     apiErrorHandler(isError, error, isSuccess, "Folder added successfully!");

//     const handleAddFolder = async () => {
//         await addFolder({ name: "New Folder" });
//     };

//     return (
//         <div>
//             <button onClick={handleAddFolder} disabled={isLoading}>
//                 {isLoading ? "Adding..." : "Add Folder"}
//             </button>
//         </div>
//     );
// };

// export default AddFolderComponent;



//  //for put and patch api 
//  import { useUpdateFolderMutation } from "../yourApiService";
// import { apiErrorHandler } from "../middleware/apiMiddleware";

// const EditFolderComponent = () => {
//     const [updateFolder, { isLoading, isError, error, isSuccess }] = useUpdateFolderMutation();

//     // Apply middleware
//     apiErrorHandler(isError, error, isSuccess, "Folder updated successfully!");

//     const handleEditFolder = async () => {
//         await updateFolder({ id: 1, name: "Updated Folder Name" });
//     };

//     return (
//         <div>
//             <button onClick={handleEditFolder} disabled={isLoading}>
//                 {isLoading ? "Updating..." : "Edit Folder"}
//             </button>
//         </div>
//     );
// };

// export default EditFolderComponent;

// ///for delete api
// import { useDeleteFolderMutation } from "../yourApiService";
// import { apiErrorHandler } from "../middleware/apiMiddleware";

// const DeleteFolderComponent = () => {
//     const [deleteFolder, { isLoading, isError, error, isSuccess }] = useDeleteFolderMutation();

//     // Apply middleware
//     apiErrorHandler(isError, error, isSuccess, "Folder deleted successfully!");

//     const handleDeleteFolder = async () => {
//         await deleteFolder(1); // Delete folder with ID 1
//     };

//     return (
//         <div>
//             <button onClick={handleDeleteFolder} disabled={isLoading}>
//                 {isLoading ? "Deleting..." : "Delete Folder"}
//             </button>
//         </div>
//     );
// };

// export default DeleteFolderComponent;
// // for fetch api 
// import { useGetFolderStructureQuery } from "../yourApiService";
// import { apiErrorHandler } from "../middleware/apiMiddleware";
// import useAutoRefetchOnReconnect from "../hooks/useAutoRefetchOnReconnect";

// const FolderComponent = () => {
//     const { data: allFolders, isLoading, isError, error, isSuccess, refetch } = useGetFolderStructureQuery();

//     // Apply middleware for error handling & success toast
//     apiErrorHandler(isError, error, isSuccess, "Folders loaded successfully!", refetch);

//     // Auto refetch when internet reconnects
//     useAutoRefetchOnReconnect(refetch);

//     return (
//         <div>
//             <h2>Folders</h2>
//             {isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(allFolders, null, 2)}</pre>}
//         </div>
//     );
// };

// export default FolderComponent;
