import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Home from "./pages/screens/Home";
import CompleteProfile from "./pages/screens/completeProfile/CompleteProfile";
import Chat from "./pages/screens/chat/Chat";
import Library from "./pages/user/library/library";
import User from "./pages/user";
import Admin from "./pages/admin";
import AddBlog from "./pages/admin/addBlog/AddBlog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="complete-profile" element={<CompleteProfile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="/user" element={<User />}>
          <Route index element={<Library />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AddBlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
