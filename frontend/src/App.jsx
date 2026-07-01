import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import Domains from './pages/Domains';
import GroupList from './pages/GroupList';
import GroupForm from './pages/GroupForm';
import GuideList from './pages/GuideList';
import GuideForm from './pages/GuideForm';

const isAuth = () => localStorage.getItem('admin_auth') === 'true' || !!localStorage.getItem('group_auth');

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

        <Route path="/groups" element={<ProtectedLayout><GroupList /></ProtectedLayout>} />
        <Route path="/groups/new" element={<ProtectedLayout><GroupForm /></ProtectedLayout>} />
        <Route path="/groups/:id/edit" element={<ProtectedLayout><GroupForm /></ProtectedLayout>} />

        <Route path="/guides" element={<ProtectedLayout><GuideList /></ProtectedLayout>} />
        <Route path="/guides/new" element={<ProtectedLayout><GuideForm /></ProtectedLayout>} />
        <Route path="/guides/:id/edit" element={<ProtectedLayout><GuideForm /></ProtectedLayout>} />

        <Route path="/domains" element={<ProtectedLayout><Domains /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
