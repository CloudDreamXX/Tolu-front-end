import { useEffect, useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import BlogTitle from '../../shared/ui/BlogTitle';
import { useGetFolderStructureQuery } from '../../redux/apis/apiSlice';
import { findPublishedContent } from '../../utils/excludePublishedContent';
import { getTitleData } from '../../utils/findById';
import AdminAside from "../../pages/admin/layout/adminAside/AdminAside";
import AdminHeader from "../../pages/admin/layout/header/AdminHeader";

function LibraryLayout() {
    const { folderId, topicId } = useParams();
    const location = useLocation();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders);
    const isNewDocRoute = location.pathname.includes('/newdoc');

    const [title, setTitle] = useState("Published Content");
    const [description, setDescription] = useState("Repository for posted and published content");
    const [breadcrumbs, setBreadcrumbs] = useState([{ name: "Posted Topics", path: "/admin2" }]);
    const [titleType, setTitleType] = useState("");

    useEffect(() => {
        const { title, description, breadcrumbs, titleType } = getTitleData(publishedContent, folderId, topicId);
        setTitle(title);
        setDescription(description);
        setBreadcrumbs(breadcrumbs);
        setTitleType(titleType);
    }, [publishedContent, folderId, topicId]);

    return (
        <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
            <div className="flex flex-col-2 h-full">
                <div className="hidden xl:block z-50">
                    <AdminAside />
                </div>
                <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
                    <AdminHeader />
                    <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
                        {!isNewDocRoute && <BlogTitle title={title} titleType={titleType} description={description} breadcrumbs={breadcrumbs} />}
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LibraryLayout;