export const findFolderById = (folder, id) => {
    if (!folder || !folder.subfolders) return null;
    for (let subfolder of folder.subfolders) {
        if (subfolder.id === id) return subfolder;
        const found = findFolderById(subfolder, id);
        if (found) return found;
    }
    return null;
}

export const findTopicById = (folder, id) => {
    if (!folder) return null;

    // Проверяем content
    if (folder.content) {
        const foundTopic = folder.content.find(item => item.id === id);
        if (foundTopic) return foundTopic;
    }

    // Проверяем subfolders рекурсивно
    if (folder.subfolders) {
        for (let subfolder of folder.subfolders) {
            const found = findTopicById(subfolder, id);
            if (found) return found;
        }
    }

    return null;
};

