import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WebPage1 from "./component/WebPage1";
import UpdatePage from "./component/UpdatePage";
import Registration from "./Auth/Registration";
import Login from "./Auth/Login";
import HomePage from "./Home/HomePage";
import AddPage from "./component/AddPage";
import VideoDetail from "./component/VideoDetail";
import UserHome from "./UserHome/UserHome";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="reg" element={<Registration />} />
          <Route path="home" element={<HomePage />} />
          <Route path="addpage" element={<AddPage />} />
          <Route path="webpage1" element={<WebPage1 />} />
          <Route path="/update/:id" element={<UpdatePage />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="userhome" element={<UserHome />} />
          {/* Detail page route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
