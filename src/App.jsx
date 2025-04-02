import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from './app/store/slice/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Coaches from './pages/coaches';
import CoachesDashboard from './pages/coaches/pages/CoachesDashboard/CoachesDashboard';
import CoachesLibraryTopicDetails from './pages/coaches/pages/coachesLibraryTopicDetails/CoachesLibraryTopicDetails';
// import MySpace from "./pages/user/mySpace/MySpace";

// Lazy Loaded Components
const Admin = lazy(() => import('./pages/admin'));
const AddBlog = lazy(() => import('./pages/admin/addBlog/AddBlog'));
const LibraryTopicDetails = lazy(
  () => import('./pages/admin/libraryTopicDetails/LibraryTopicDetails')
);
const Profile = lazy(() => import('./pages/admin/profile/Profile'));
const User = lazy(() => import('./pages/user'));
const Chat = lazy(() => import('./pages/user/chat&search/Chat'));
const Library = lazy(() => import('./pages/user/library/Library'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Home = lazy(() => import('./pages/screens/Home'));
const CompleteProfile = lazy(
  () => import('./pages/screens/completeProfile/CompleteProfile')
);
const MySpace = lazy(() => import('./pages/user/mySpace/MySpace'));

// new pages
const LibraryAdmin = lazy(() => import('./pages/admin/Library'));
const Folder = lazy(() => import('./pages/admin/Library/Folder'));
const LibraryAdminLayout = lazy(() => import('./layout/LibraryAdminLayout'));
const Topic = lazy(() => import('./pages/admin/Library/Topic'));
const Document = lazy(() => import('./pages/admin/Library/Document'));
const NewDoc = lazy(() => import('./pages/admin/Library/NewDoc'));
const LibraryUserLayout = lazy(() => import('./layout/LibraryUserLayout'));
const LibraryNew = lazy(() => import('./pages/user/LibraryNew'));
const PostLayout = lazy(() => import('./layout/PostLayout'));
const Post = lazy(() => import('./pages/user/Post'));

// A separate component to handle routes and listen for location changes
function AppRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Start loading on route change
    dispatch(setLoading(true));
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500); // Simulated delay

    return () => clearTimeout(timer);
  }, [location.pathname, dispatch]);

  return (
    // <Routes>
    //   {/* Guest & Public Routes (Accessible if NOT logged in) */}
    //   <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
    //     <Route path="/auth" element={<Signup />} />
    //     <Route path="/" element={<Home />} />
    //   </Route>

    //   {/* User Routes */}
    //   <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
    //     <Route path="/user" element={<User />}>
    //       <Route path="library" element={<Library />} />
    //       <Route index element={<MySpace />} />
    //       <Route path="chat" element={<Chat />} />
    //       <Route path="profile" element={<Profile />} />
    //     </Route>
    //   </Route>

    //   {/* Admin Routes */}
    //   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    //     <Route path="/admin" element={<Admin />}>
    //       <Route index element={<AddBlog />} />
    //       <Route path="library-topic-details" element={<LibraryTopicDetails />} />
    //     </Route>
    //   </Route>

    //   {/* Complete Profile (Accessible to both user and admin) */}
    //   <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
    //     <Route path="/complete-profile" element={<CompleteProfile />} />
    //   </Route>
    // </Routes>

    <Routes>
      {/* Guest Routes */}
      <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
        <Route path="/auth" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<User />}>
          <Route path="library" element={<Library />} />
          <Route index element={<MySpace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
        <Route path="/librarynew" element={<LibraryUserLayout />}>
          <Route index element={<LibraryNew />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
        <Route path="/post/:postName" element={<PostLayout />}>
          <Route index element={<Post />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AddBlog />} />
          <Route
            path="library-topic-details"
            element={<LibraryTopicDetails />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
        <Route path="/admin2" element={<LibraryAdminLayout />}>
          <Route index element={<LibraryAdmin />} />
          <Route path="folder/:folderId" element={<Folder />} />
          <Route path="folder/:folderId/topic/:topicId" element={<Topic />} />
          <Route path="document/:docId" element={<Document />} />
          <Route path="newdoc" element={<NewDoc />} />
          <Route
            path="folder/:folderId/topic/:topicId/newdoc"
            element={<NewDoc />}
          />
          <Route
            path="library-topic-details"
            element={<LibraryTopicDetails />}
          />
        </Route>
      </Route>

      {/* Instructor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['coaches']} />}>
        <Route path="/coaches" element={<Coaches />}>
          <Route index element={<CoachesDashboard />} />
          <Route
            path="coaches-library-topic-details"
            element={<CoachesLibraryTopicDetails />}
          />
        </Route>
      </Route>

      {/* Complete Profile */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']} />
        }
      >
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Route>
    </Routes>
  );
}

function App() {
  const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <BrowserRouter>
      {/* Global Loading Screen */}
      {isLoading && <LoadingScreen />}
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
      </Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </BrowserRouter>
  );
}

export default App;
