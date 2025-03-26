import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAddFolderData,
  setDetailResponse,
  setFolderName,
} from '../../../../redux/slice/sidebarSlice';
import Folder from './Folder';
import { useNavigate } from 'react-router-dom';

// Helper function: recursively finds the target folder in the tree
// and returns an object mapping each level to { id, name }.
const getFolderPath = (targetId, folders, level = 0, path = {}) => {
  for (let folder of folders) {
    // Build a new path including the current folder at this level.
    const newPath = { ...path, [level]: { id: folder.id, name: folder.name } };

    // If this folder is the target, return the complete path.
    if (folder.id === targetId) {
      return newPath;
    }

    // Otherwise, if the folder has subfolders, search recursively.
    if (folder.subfolders && folder.subfolders.length > 0) {
      const result = getFolderPath(
        targetId,
        folder.subfolders,
        level + 1,
        newPath
      );
      if (result) return result;
    }
  }
  return null;
};

const FolderTree = ({ allFolders, addArticlesHandler }) => {
  // openFolders now stores an object mapping level to { id, name }
  const [openFolders, setOpenFolders] = useState({});
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log('openFolders', openFolders);
  const SelectedFolderName = Object.values(openFolders)
    .map((folder) => folder?.name)
    .join('/');
  console.log('foldername', SelectedFolderName);
  // Assuming your Redux store holds the selected folder in state.sidebar.addFolder.
  const selectedFolderState = useSelector((state) => state.sidebar.addFolder);
  const selectedFolderId = selectedFolderState
    ? selectedFolderState.folderId
    : null;

  const folderName = useSelector((state) => state.sidebar.folderName);
  console.log('folderName', folderName);
  // When the selected folder changes, compute the full folder path (with id and name)
  // and update the openFolders state.
  useEffect(() => {
    if (selectedFolderId && allFolders && allFolders.posted_topics) {
      const folderPath = getFolderPath(
        selectedFolderId,
        allFolders.posted_topics
      );
      if (folderPath) {
        setOpenFolders(folderPath);
      }
    }
  }, [selectedFolderId, allFolders]);

  useEffect(() => {
    dispatch(setFolderName(SelectedFolderName));
  }, [SelectedFolderName]);
  // Toggle folder open/close (store both id and name in openFolders state)
  const toggleFolder = (id, name, level) => {
    console.log('toggleFolder', id, level);
    setOpenFolders((prev) => ({
      ...prev,
      [level]: prev[level] && prev[level].id === id ? null : { id, name },
    }));
    dispatch(
      setAddFolderData({
        folderId: id,
        add: false,
      })
    );
    dispatch(setDetailResponse(false));
    if (level !== 0) {
      navigate(`/admin`);
    }
  };

  return (
    <div className="p-1 custom-scroll rounded-lg">
      {allFolders?.saved_topics?.map((folder) => (
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
      {allFolders?.posted_topics?.map((folder) => (
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
      {allFolders?.unpublished_topics?.map((folder) => (
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
