export const findPublishedContent = (folders) => {
    return folders?.posted_topics?.find(topic => topic.name === "Published Content");
};