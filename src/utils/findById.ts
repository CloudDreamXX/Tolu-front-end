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
    if (folder.content) {
        const foundTopic = folder.content.find(item => item.id === id);
        if (foundTopic) return foundTopic;
    }
    if (folder.subfolders) {
        for (let subfolder of folder.subfolders) {
            const found = findTopicById(subfolder, id);
            if (found) return found;
        }
    }

    return null;
};

export const getBreadcrumbs = (publishedContent, folderId, topicId, docId) => {
    let breadcrumbs = [{ name: "Library", path: "/admin2" }];
  
    if (!publishedContent) return breadcrumbs;

    const folder = folderId ? findFolderById(publishedContent, folderId) : null;
    const topic = topicId ? findTopicById(publishedContent, topicId) : null;

    if (folder) {
        breadcrumbs.push({ name: folder.name, path: `/admin2/folder/${folderId}` });
    }

    if (topic) {
        breadcrumbs.push({ name: topic.title, path: `/admin2/folder/${folderId}/topic/${topicId}` });
    }

    return breadcrumbs;
};
