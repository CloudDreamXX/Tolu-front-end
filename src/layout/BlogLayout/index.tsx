import { Outlet, useParams } from 'react-router-dom';
import BlogTitle from '../../shared/ui/BlogTitle';
import { useGetFolderStructureQuery } from '../../redux/apis/apiSlice';
import { findPublishedContent } from '../../utils/excludePublishedContent';
import { findFolderById } from '../../utils/findFolderById';
import AdminAside from "../../pages/admin/layout/adminAside/AdminAside";
import AdminHeader from "../../pages/admin/layout/header/AdminHeader";

function BlogLayout() {
    const { folderId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders);

    const currentFolder = folderId
        ? findFolderById(publishedContent, folderId)
        : publishedContent;

    return (
        <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
            <div className="flex flex-col-2 h-full">
            <div className="hidden xl:block z-50">
                <AdminAside />
            </div>
            <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
                <AdminHeader />
                <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
                    <BlogTitle title={currentFolder?.name || "Published Content"} />
                    <Outlet />
                </div>
            </div>
            </div>
        </section>
    );
}

export default BlogLayout;
