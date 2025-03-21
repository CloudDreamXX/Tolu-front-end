import { Outlet, useParams } from 'react-router-dom';
import BlogTitle from '../../shared/ui/BlogTitle';
import { useGetFolderStructureQuery } from '../../redux/apis/apiSlice';
import { findPublishedContent } from '../../utils/excludePublishedContent';
import { findFolderById, findTopicById } from '../../utils/findById';
import AdminAside from "../../pages/admin/layout/adminAside/AdminAside";
import AdminHeader from "../../pages/admin/layout/header/AdminHeader";

function BlogLayout() {
    const { folderId, topicId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders);

    let title = "Published Content";
    let description = "Repository for posted and published content";
    let breadcrumbs = [{ name: "Posted Topics", path: "/admin2" }];

    if (folderId) {
        const folder = findFolderById(publishedContent, folderId);
        if (folder) {
            title = folder.name;
            description = folder.description || "";
            breadcrumbs.push({ name: folder.name, path: `/admin2/folder/${folderId}` });
        }
    }

    if (topicId) {
        const topic = findTopicById(publishedContent, topicId);
        if (topic) {
            title = topic.title;
            description = "";
            breadcrumbs.push({ name: topic.title });
        }
    }

    return (
        <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
            <div className="flex flex-col-2 h-full">
                <div className="hidden xl:block z-50">
                    <AdminAside />
                </div>
                <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
                    <AdminHeader />
                    <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
                        <BlogTitle title={title} description={description} breadcrumbs={breadcrumbs} />
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogLayout;
