import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CourseDetail from "./pages/CourseDetail";

function App() {
  return (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/course/:id" element={<CourseDetail />} />
          </Routes>
        </Router>
  );
}

export default App;