import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Home from "./pages/screens/Home";
import CompleteProfile from "./pages/screens/completeProfile/CompleteProfile";
import Chat from "./pages/screens/chat/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="complete-profile" element={<CompleteProfile />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
