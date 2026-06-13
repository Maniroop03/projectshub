import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdDashboard, MdFolderOpen, MdAddCircleOutline, MdPeople,
    MdPersonAdd, MdSupervisorAccount, MdPersonAddAlt1, MdLogout,
} from 'react-icons/md';

const navItems = [
    { section: 'Overview', items: [{ to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' }] },
    {
        section: 'Projects',
        items: [
            { to: '/projects', icon: <MdFolderOpen />, label: 'All Projects' },
            { to: '/projects/new', icon: <MdAddCircleOutline />, label: 'Add Project' },
        ],
    },
    {
        section: 'Groups',
        items: [
            { to: '/groups', icon: <MdPeople />, label: 'All Groups' },
            { to: '/groups/new', icon: <MdPersonAdd />, label: 'Add Group' },
        ],
    },
    {
        section: 'Guides',
        items: [
            { to: '/guides', icon: <MdSupervisorAccount />, label: 'All Guides' },
            { to: '/guides/new', icon: <MdPersonAddAlt1 />, label: 'Add Guide' },
        ],
    },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = () => { localStorage.removeItem('admin_auth'); navigate('/'); };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>📚 Project Hub</h1>
                <span>Student Project System</span>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((section) => (
                    <div key={section.section}>
                        <div className="nav-section-label">{section.section}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
            <div style={{ padding: '12px' }}>
                <button className="btn btn-outline w-full" style={{ width: '100%' }} onClick={handleLogout}>
                    <MdLogout /> Logout
                </button>
            </div>
            <div className="sidebar-footer">
                Developed & Maintained by<br />
                <strong>Mrs. Priyanka Pandarinath</strong><br />
                Assistant Professor
            </div>
        </aside>
    );
}
