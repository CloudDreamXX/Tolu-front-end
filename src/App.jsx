import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Home from "./pages/screens/Home";
import CompleteProfile from "./pages/screens/completeProfile/CompleteProfile";
// import Chat from "./pages/screens/chat/Chat";
import Library from "./pages/user/library/library";
import User from "./pages/user";
import Admin from "./pages/admin";
import AddBlog from "./pages/admin/addBlog/AddBlog";
import { Toaster } from "react-hot-toast";
import LibraryTopicDetails from "./pages/admin/libraryTopicDetails/LibraryTopicDetails";
import Profile from "./pages/admin/profile/Profile";
import Chat from "./pages/user/chat&search/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Signup />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="chat" element={<Chat />} /> */}
          <Route path="complete-profile" element={<CompleteProfile />} />
        <Route path="/user" element={<User />}>
          <Route index element={<Library />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AddBlog />} />
          <Route path="library-topic-details" element={<LibraryTopicDetails />} />

        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />

    </BrowserRouter>
  );
}

export default App;
