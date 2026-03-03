import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import GuideList from './pages/GuideList';
import GuideForm from './pages/GuideForm';

const isAuth = () => localStorage.getItem('admin_auth') === 'true';

function ProtectedLayout({ children }) {
  if (!isAuth()) return <Navigate to="/" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {children}
        <footer className="footer-bar">
          Developed and Maintained by &nbsp;<strong>Mrs. Priyanka Pandarinath</strong>, Assistant Professor
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />

        <Route path="/projects" element={<ProtectedLayout><ProjectList /></ProtectedLayout>} />
        <Route path="/projects/new" element={<ProtectedLayout><ProjectForm /></ProtectedLayout>} />
        <Route path="/projects/:id" element={<ProtectedLayout><ProjectDetail /></ProtectedLayout>} />
        <Route path="/projects/:id/edit" element={<ProtectedLayout><ProjectForm /></ProtectedLayout>} />

        <Route path="/students" element={<ProtectedLayout><StudentList /></ProtectedLayout>} />
        <Route path="/students/new" element={<ProtectedLayout><StudentForm /></ProtectedLayout>} />
        <Route path="/students/:id/edit" element={<ProtectedLayout><StudentForm /></ProtectedLayout>} />

        <Route path="/guides" element={<ProtectedLayout><GuideList /></ProtectedLayout>} />
        <Route path="/guides/new" element={<ProtectedLayout><GuideForm /></ProtectedLayout>} />
        <Route path="/guides/:id/edit" element={<ProtectedLayout><GuideForm /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
