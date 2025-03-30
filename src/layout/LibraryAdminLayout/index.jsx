import { useEffect, useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BlogTitle from '../../shared/ui/BlogTitle';
import {
  fetchFolderStructure,
  fetchPostedStructure,
} from '../../app/store/slice/adminDataSlice';
import { getTitleData } from '../../utils/findById';
import AdminAside from '../../pages/admin/layout/adminAside/AdminAside';
import AdminHeader from '../../pages/admin/layout/header/AdminHeader';

function LibraryAdminLayout() {
  const { folderId, topicId } = useParams();
  const location = useLocation();
  const isNewDocRoute = location.pathname.includes('/newdoc');
  const dispatch = useDispatch();
  const { folderStructure, postedStructure } = useSelector(
    (state) => state.adminData
  );
  const [title, setTitle] = useState('Published Content');
  const [description, setDescription] = useState(
    'Repository for posted and published content'
  );
  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Posted Topics', path: '/admin2' },
  ]);
  const [titleType, setTitleType] = useState('');

  useEffect(() => {
    if (!folderStructure) {
      dispatch(fetchFolderStructure());
    }
    if (!postedStructure) {
      dispatch(fetchPostedStructure());
    }
  }, [dispatch, folderStructure, postedStructure]);

  useEffect(() => {
    if (folderStructure) {
      const { title, description, breadcrumbs, titleType } = getTitleData(
        folderStructure,
        folderId,
        topicId
      );
      setTitle(title);
      setDescription(description);
      setBreadcrumbs(breadcrumbs);
      setTitleType(titleType);
    }
  }, [folderStructure, folderId, topicId]);

  return (
    <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
      <div className="flex flex-col-2 h-full">
        <div className="hidden xl:block z-50">
          <AdminAside />
        </div>
        <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
          <AdminHeader />
          <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
            {!isNewDocRoute && (
              <BlogTitle
                title={title}
                titleType={titleType}
                description={description}
                breadcrumbs={breadcrumbs}
              />
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LibraryAdminLayout;
