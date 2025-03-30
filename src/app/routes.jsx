import { lazy } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const Admin = lazy(() => import('../pages/admin'));
const AddBlog = lazy(() => import('../pages/admin/addBlog/AddBlog'));
const LibraryTopicDetails = lazy(
  () => import('../pages/admin/libraryTopicDetails/LibraryTopicDetails')
);
const Profile = lazy(() => import('../pages/admin/profile/Profile'));
const User = lazy(() => import('../pages/user'));
const Chat = lazy(() => import('../pages/user/chat&search/Chat'));
const Library = lazy(() => import('../pages/user/library/Library'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const Home = lazy(() => import('../pages/screens/Home'));
const CompleteProfile = lazy(
  () => import('../pages/screens/completeProfile/CompleteProfile')
);
const MySpace = lazy(() => import('../pages/user/mySpace/MySpace'));
const Blog = lazy(() => import('../pages/admin/Blog'));
const Folder = lazy(() => import('../pages/admin/Folder'));
const BlogLayout = lazy(() => import('../layout/BlogLayout'));
const Coaches = lazy(() => import('../pages/coaches'));
const CoachesDashboard = lazy(
  () => import('../pages/coaches/pages/CoachesDashboard/CoachesDashboard')
);
const CoachesLibraryTopicDetails = lazy(
  () =>
    import(
      '../pages/coaches/pages/coachesLibraryTopicDetails/CoachesLibraryTopicDetails'
    )
);

const routes = [
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['guest']} />,
    children: [
      { path: 'auth', element: <Signup /> },
      { path: '/', element: <Home /> },
    ],
  },
  {
    path: '/user',
    element: <ProtectedRoute allowedRoles={['user']} />,
    children: [
      { path: '', element: <User /> },
      { path: 'library', element: <Library /> },
      { path: '', element: <MySpace /> },
      { path: 'chat', element: <Chat /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: '', element: <Admin /> },
      { path: '', element: <AddBlog /> },
      { path: 'library-topic-details', element: <LibraryTopicDetails /> },
    ],
  },
  {
    path: '/admin2',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: '', element: <BlogLayout /> },
      { path: '', element: <Blog /> },
      { path: 'folder/:folderId', element: <Folder /> },
    ],
  },
  {
    path: '/coaches',
    element: <ProtectedRoute allowedRoles={['coaches']} />,
    children: [
      { path: '', element: <Coaches /> },
      { path: '', element: <CoachesDashboard /> },
      {
        path: 'coaches-library-topic-details',
        element: <CoachesLibraryTopicDetails />,
      },
    ],
  },
  {
    path: '/complete-profile',
    element: <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']} />,
    children: [{ path: '', element: <CompleteProfile /> }],
  },
];

export default routes;
