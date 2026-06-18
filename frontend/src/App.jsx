import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home      from "./pages/Home";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Board     from "./pages/Board";
import MyTasks   from "./pages/MyTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/mytasks"   element={<MyTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;