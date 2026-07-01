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
const isAdmin = () => localStorage.getItem('admin_auth') === 'true';
const isGroupAuth = () => !!localStorage.getItem('group_auth');

function ProtectedLayout({ children, requireAdmin = false }) {
  if (!isAuth()) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/projects" replace />;
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
        <Route path="/dashboard" element={<ProtectedLayout requireAdmin><Dashboard /></ProtectedLayout>} />

        <Route path="/projects" element={<ProtectedLayout><ProjectList /></ProtectedLayout>} />
        <Route path="/projects/new" element={<ProtectedLayout requireAdmin><ProjectForm /></ProtectedLayout>} />
        <Route path="/projects/:id" element={<ProtectedLayout><ProjectDetail /></ProtectedLayout>} />
        <Route path="/projects/:id/edit" element={<ProtectedLayout requireAdmin><ProjectForm /></ProtectedLayout>} />

        <Route path="/groups" element={<ProtectedLayout requireAdmin><GroupList /></ProtectedLayout>} />
        <Route path="/groups/new" element={<ProtectedLayout requireAdmin><GroupForm /></ProtectedLayout>} />
        <Route path="/groups/:id/edit" element={<ProtectedLayout requireAdmin><GroupForm /></ProtectedLayout>} />

        <Route path="/guides" element={<ProtectedLayout requireAdmin><GuideList /></ProtectedLayout>} />
        <Route path="/guides/new" element={<ProtectedLayout requireAdmin><GuideForm /></ProtectedLayout>} />
        <Route path="/guides/:id/edit" element={<ProtectedLayout requireAdmin><GuideForm /></ProtectedLayout>} />

        <Route path="/domains" element={<ProtectedLayout requireAdmin><Domains /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
