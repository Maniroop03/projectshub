import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject, formatApiError } from '../api';
import { MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';

const TYPE_OPTS = ['', 'Mini', 'Major'];
const STATUS_OPTS = ['', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'];

const statusBadge = (s) => {
    const map = { 'Submitted': 'submitted', 'Under Review': 'review', 'Approved': 'approved', 'Rejected': 'rejected', 'Completed': 'completed' };
    return <span className={`badge badge-${map[s] || 'submitted'}`}>{s}</span>;
};

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const isAdmin = () => localStorage.getItem('admin_auth') === 'true';
    const getGroupAuth = () => {
        try {
            const g = localStorage.getItem('group_auth');
            return g ? JSON.parse(g) : null;
        } catch {
            return null;
        }
    };
    const groupAuth = getGroupAuth();
    const isGroupUser = !isAdmin() && !!groupAuth;

    const load = useCallback(() => {
        setLoading(true);
        setError('');
        const params = {};
        if (!isGroupUser) {
            if (typeFilter) params.type = typeFilter;
            if (statusFilter) params.status = statusFilter;
        }
        if (groupAuth) {
            params.batch = groupAuth.batch;
        }

        getProjects(params)
            .then((r) => setProjects(Array.isArray(r.data) ? r.data : []))
            .catch((err) => { console.error(err); setError(formatApiError(err, 'Failed to load projects.')); })
            .finally(() => setLoading(false));
    }, [typeFilter, statusFilter, isGroupUser, groupAuth]);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) load();
        });
        return () => { active = false; };
    }, [load]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete project "${title}"?`)) return;
        await deleteProject(id);
        load();
    };

    const filtered = projects.filter((p) =>
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.domain || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.guide?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    if (isGroupUser) {
        return (
            <div className="page-container">
                {error && (
                    <div className="alert alert-error">
                        {(() => {
                            try {
                                return String(error).trim() || 'An error occurred. Please try again.';
                            } catch {
                                return 'An error occurred. Please try again.';
                            }
                        })()}
                    </div>
                )}
                <div className="page-header flex items-center justify-between">
                    <div>
                        <h1 className="page-title">My Group</h1>
                        <p className="page-subtitle">Only your group members and project details are shown.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-center"><div className="loading-spinner" /></div>
                ) : (
                    <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                            <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                                <h3 style={{ marginTop: 0 }}>Group Details</h3>
                                <p><strong>Batch:</strong> {groupAuth?.batch || '—'}</p>
                                <p><strong>Section:</strong> {groupAuth?.section || '—'}</p>
                                <p><strong>Domain:</strong> {groupAuth?.domain || '—'}</p>
                                <p><strong>Department:</strong> {groupAuth?.department || '—'}</p>
                                <p><strong>Lead Roll No:</strong> {groupAuth?.rollNo || '—'}</p>
                            </div>
                            <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                                <h3 style={{ marginTop: 0 }}>Group Members</h3>
                                {groupAuth?.members?.length ? (
                                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                                        {groupAuth.members.map((m) => (
                                            <li key={m._id || m.rollNo} style={{ marginBottom: 6 }}>
                                                <strong>{m.name || 'Member'}</strong> — {m.rollNo || '—'}
                                                {m.role ? ` (${m.role})` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No members available.</p>
                                )}
                            </div>
                        </div>

                        <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ marginTop: 0 }}>Project Details</h3>
                            {filtered.length ? (
                                filtered.map((p) => (
                                    <div key={p._id} style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
                                        <p style={{ margin: '4px 0' }}><strong>Title:</strong> {p.title}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Type:</strong> {p.projectType || '—'}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Domain:</strong> {p.domain || '—'}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Status:</strong> {p.status || '—'}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Guide:</strong> {p.guide?.name || '—'}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Submitted:</strong> {p.submissionDate ? new Date(p.submissionDate).toLocaleDateString('en-IN') : '—'}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Abstract:</strong> {p.abstract || '—'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No project details found for this group.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="page-container">
            {error && (
                <div className="alert alert-error">
                    {(() => {
                        try {
                            return String(error).trim() || 'An error occurred. Please try again.';
                        } catch {
                            return 'An error occurred. Please try again.';
                        }
                    })()}
                </div>
            )}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">All Projects</h1>
                    <p className="page-subtitle">{projects.length} project(s) total</p>
                </div>
                    {isAdmin() && <Link to="/projects/new" className="btn btn-primary"><MdAdd /> Add Project</Link>}
            </div>

            <div className="filter-bar">
                <input className="form-input" style={{ maxWidth: 260 }} placeholder="🔍 Search title, domain, guide..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className="form-select" style={{ maxWidth: 160 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    {TYPE_OPTS.filter(Boolean).map((t) => <option key={t} value={t}>{t} Project</option>)}
                </select>
                <select className="form-select" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-outline btn-sm" onClick={load}>Refresh</button>
            </div>

            {loading ? (<div className="loading-center"><div className="loading-spinner" /></div>) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📂</div>
                    <p>No projects found.</p>
                    {isAdmin() && <Link to="/projects/new" className="btn btn-primary mt-4"><MdAdd /> Add First Project</Link>}
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
                                <th>Members</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{i + 1}</td>
                                    <td><span className={`badge badge-${p.projectType.toLowerCase()}`}>{p.projectType}</span></td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.title}>{p.title}</td>
                                    <td>{p.domain || '—'}</td>
                                    <td>{p.guide?.name || '—'}</td>
                                    <td>{p.students?.length || 0}</td>
                                    <td>{p.submissionDate ? new Date(p.submissionDate).toLocaleDateString('en-IN') : '—'}</td>
                                    <td>{statusBadge(p.status)}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link to={`/projects/${p._id}`} className="btn btn-outline btn-sm" title="View"><MdVisibility /></Link>
                                            {isAdmin() && <Link to={`/projects/${p._id}/edit`} className="btn btn-outline btn-sm" title="Edit"><MdEdit /></Link>}
                                            {isAdmin() && <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDelete(p._id, p.title)}><MdDelete /></button>}
                                        </div>
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
