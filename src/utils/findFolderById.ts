export const findFolderById = (folder, id) => {
    if (!folder || !folder.subfolders) return null;
    for (let subfolder of folder.subfolders) {
        if (subfolder.id === id) return subfolder;
        const found = findFolderById(subfolder, id);
        if (found) return found;
    }
    return null;
}
