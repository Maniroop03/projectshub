import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjectStats, getProjects } from '../api';
import { MdFolderOpen, MdSchool, MdDomainVerification, MdCheckCircle, MdPendingActions, MdAddCircleOutline } from 'react-icons/md';

const statusBadge = (status) => {
    const map = { 'Submitted': 'submitted', 'Under Review': 'review', 'Approved': 'approved', 'Rejected': 'rejected', 'Completed': 'completed' };
    return <span className={`badge badge-${map[status] || 'submitted'}`}>{status}</span>;
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getProjectStats(), getProjects()])
            .then(([statsRes, projectsRes]) => {
                setStats(statsRes.data);
                setRecent(projectsRes.data.slice(0, 8));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-center"><div className="loading-spinner" /></div>;

    return (
        <div className="page-container">
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of all group projects</p>
                </div>
                <Link to="/projects/new" className="btn btn-primary"><MdAddCircleOutline /> New Project</Link>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Projects', value: stats?.total ?? 0, icon: <MdFolderOpen /> },
                    { label: 'Mini Projects', value: stats?.mini ?? 0, icon: <MdSchool /> },
                    { label: 'Major Projects', value: stats?.major ?? 0, icon: <MdDomainVerification /> },
                    { label: 'Submitted', value: stats?.submitted ?? 0, icon: <MdPendingActions /> },
                    { label: 'Approved', value: stats?.approved ?? 0, icon: <MdCheckCircle /> },
                    { label: 'Completed', value: stats?.completed ?? 0, icon: <MdCheckCircle /> },
                ].map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div style={{ fontSize: '1.6rem', color: 'var(--accent-purple)', marginBottom: 8 }}>{s.icon}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="section-title">Recent Project Submissions</div>
            {recent.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📂</div>
                    <p>No projects yet. <Link to="/projects/new" style={{ color: 'var(--accent-purple)' }}>Add the first project →</Link></p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Domain</th>
                                <th>Guide</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{i + 1}</td>
                                    <td><span className={`badge badge-${p.projectType.toLowerCase()}`}>{p.projectType}</span></td>
                                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                                    <td>{p.domain || '—'}</td>
                                    <td>{p.guide?.name || '—'}</td>
                                    <td>{p.submissionDate ? new Date(p.submissionDate).toLocaleDateString('en-IN') : '—'}</td>
                                    <td>{statusBadge(p.status)}</td>
                                    <td>
                                        <Link to={`/projects/${p._id}`} className="btn btn-outline btn-sm">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
