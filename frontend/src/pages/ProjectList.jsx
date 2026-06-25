import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        setError('');
        const params = {};
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        getProjects(params)
            .then((r) => setProjects(Array.isArray(r.data) ? r.data : []))
            .catch((err) => { console.error(err); setError(formatApiError(err, 'Failed to load projects.')); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [typeFilter, statusFilter]);

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

    return (
        <div className="page-container">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">All Projects</h1>
                    <p className="page-subtitle">{projects.length} project(s) total</p>
                </div>
                <Link to="/projects/new" className="btn btn-primary"><MdAdd /> Add Project</Link>
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
                    <Link to="/projects/new" className="btn btn-primary mt-4"><MdAdd /> Add First Project</Link>
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
                                            <Link to={`/projects/${p._id}/edit`} className="btn btn-outline btn-sm" title="Edit"><MdEdit /></Link>
                                            <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDelete(p._id, p.title)}><MdDelete /></button>
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
