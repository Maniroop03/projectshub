import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProject, deleteProject, notifyGuide } from '../api';
import {
    MdArrowBack, MdEdit, MdDelete, MdWhatsapp,
    MdInsertDriveFile, MdPerson, MdGroup, MdCalendarToday,
} from 'react-icons/md';

const statusBadge = (s) => {
    const map = { 'Submitted': 'submitted', 'Under Review': 'review', 'Approved': 'approved', 'Rejected': 'rejected', 'Completed': 'completed' };
    return <span className={`badge badge-${map[s] || 'submitted'}`}>{s}</span>;
};

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waLoading, setWaLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        getProject(id).then((r) => setProject(r.data)).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this project?')) return;
        await deleteProject(id);
        navigate('/projects');
    };

    const handleWhatsApp = async () => {
        setWaLoading(true); setMsg({ text: '', type: '' });
        try {
            const r = await notifyGuide(id);
            setMsg({ text: r.data.message, type: 'success' });
        } catch (err) {
            setMsg({ text: err.response?.data?.error || 'Failed to send WhatsApp message.', type: 'error' });
        } finally { setWaLoading(false); }
    };

    if (loading) return <div className="loading-center"><div className="loading-spinner" /></div>;
    if (!project) return <div className="page-container"><div className="alert alert-error">Project not found.</div></div>;

    const p = project;

    return (
        <div className="page-container">
            <div className="page-header flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div className="flex items-center gap-3">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span className={`badge badge-${p.projectType.toLowerCase()}`}>{p.projectType} Project</span>
                            {statusBadge(p.status)}
                        </div>
                        <h1 className="page-title" style={{ fontSize: '1.6rem', marginBottom: 0 }}>{p.title}</h1>
                    </div>
                </div>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-whatsapp"
                        onClick={handleWhatsApp}
                        disabled={waLoading}
                        title="Send project details to guide via WhatsApp"
                    >
                        {waLoading
                            ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending...</>
                            : <><MdWhatsapp style={{ fontSize: '1.2rem' }} /> Notify Guide via WhatsApp</>}
                    </button>
                    <Link to={`/projects/${p._id}/edit`} className="btn btn-outline"><MdEdit /> Edit</Link>
                    <button className="btn btn-danger" onClick={handleDelete}><MdDelete /> Delete</button>
                </div>
            </div>

            {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left column */}
                <div>
                    <div className="card mb-6">
                        <div className="card-body">
                            <div className="section-title">Project Information</div>
                            {[
                                { label: 'Type', value: <span className={`badge badge-${p.projectType.toLowerCase()}`}>{p.projectType} Project</span> },
                                { label: 'Domain', value: p.domain || '—' },
                                { label: 'Status', value: statusBadge(p.status) },
                                { label: 'Submission Date', value: p.submissionDate ? new Date(p.submissionDate).toLocaleDateString('en-IN') : '—' },
                                { label: 'Academic Year', value: p.academicYear || '—' },
                                { label: 'Batch Year', value: p.batchYear || '—' },
                            ].map((row) => (
                                <div className="detail-row" key={row.label}>
                                    <span className="detail-label">{row.label}</span>
                                    <span className="detail-value">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card mb-6">
                        <div className="card-body">
                            <div className="section-title"><MdPerson /> Guide Details</div>
                            {p.guide ? (
                                <>
                                    <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value"><strong>{p.guide.name}</strong></span></div>
                                    <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{p.guide.phone}</span></div>
                                    <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{p.guide.email || '—'}</span></div>
                                    <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">{p.guide.department || '—'}</span></div>
                                </>
                            ) : <p className="text-muted">No guide assigned.</p>}

                            {p.coGuide && (
                                <>
                                    <div className="divider" />
                                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 10 }}>CO-GUIDE</div>
                                    <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{p.coGuide.name}</span></div>
                                    <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{p.coGuide.phone}</span></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div>
                    <div className="card mb-6">
                        <div className="card-body">
                            <div className="section-title"><MdGroup /> Student Team ({p.students?.length || 0})</div>
                            {p.students?.length === 0 ? <p className="text-muted">No students assigned.</p> : (
                                <div className="table-wrapper">
                                    <table>
                                        <thead><tr><th>Name</th><th>Roll No</th><th>Year</th><th>Dept</th></tr></thead>
                                        <tbody>
                                            {p.students.map((s) => (
                                                <tr key={s._id}>
                                                    <td>{s.name}</td>
                                                    <td>{s.rollNo}</td>
                                                    <td>{s.year}</td>
                                                    <td>{s.department || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {p.pptFilePath && (
                        <div className="card mb-6">
                            <div className="card-body">
                                <div className="section-title"><MdInsertDriveFile /> Uploaded File</div>
                                <a
                                    href={`http://localhost:5000${p.pptFilePath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline"
                                    style={{ gap: 10 }}
                                >
                                    <MdInsertDriveFile /> {p.pptOriginalName || 'Download File'}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {p.abstract && (
                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Abstract</div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{p.abstract}</p>
                    </div>
                </div>
            )}

            {p.remarks && (
                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Remarks</div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{p.remarks}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
