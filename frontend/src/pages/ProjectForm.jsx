import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProject, updateProject, getProject, getGuides, getGroups } from '../api';
import { MdCloudUpload, MdInsertDriveFile, MdSave, MdArrowBack } from 'react-icons/md';

const DOMAINS = ['Web Development', 'Machine Learning', 'Data Science', 'IoT', 'Mobile App', 'Embedded Systems', 'Cybersecurity', 'Cloud Computing', 'Blockchain', 'AR/VR', 'Image Processing', 'NLP', 'Other'];
const STATUSES = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'];

export default function ProjectForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const fileRef = useRef();

    const [form, setForm] = useState({
        projectType: 'Mini', title: '', domain: '', abstract: '',
        submissionDate: '', status: 'Submitted', academicYear: '', batchYear: '',
        guide: '', coGuide: '', students: [], remarks: '',
    });
    const [file, setFile] = useState(null);
    const [existingFile, setExistingFile] = useState('');
    const [guides, setGuides] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [drag, setDrag] = useState(false);

    useEffect(() => {
        getGuides().then((r) => setGuides(r.data)).catch(console.error);
        getGroups().then((r) => setGroups(r.data)).catch(console.error);
        if (isEdit) {
            getProject(id).then((r) => {
                const p = r.data;
                setForm({
                    projectType: p.projectType || 'Mini',
                    title: p.title || '', domain: p.domain || '',
                    abstract: p.abstract || '',
                    submissionDate: p.submissionDate ? p.submissionDate.split('T')[0] : '',
                    status: p.status || 'Submitted',
                    academicYear: p.academicYear || '', batchYear: p.batchYear || '',
                    guide: p.guide?._id || '', coGuide: p.coGuide?._id || '',
                    students: p.students?.map((s) => s._id) || [],
                    remarks: p.remarks || '',
                });
                setExistingFile(p.pptOriginalName || '');
            }).catch(console.error);
        }
    }, [id, isEdit]);
    
    useEffect(() => {
        if (groups.length > 0) {
            setForm(f => {
                const eligibleSids = groups.filter(s => {
                    if (f.projectType === 'Major') return s.year === 'IV';
                    if (f.projectType === 'Mini') return s.year === 'III';
                    return true;
                }).map(s => s._id);
                const newStudents = f.students.filter(sid => eligibleSids.includes(sid));
                if (newStudents.length !== f.students.length) return { ...f, students: newStudents };
                return f;
            });
        }
    }, [form.projectType, groups]);

    const toggleGroup = (sid) => {
        setForm((f) => ({
            ...f,
            students: f.students.includes(sid) ? f.students.filter((x) => x !== sid) : [...f.students, sid],
        }));
    };

    const handleFile = (f) => {
        if (f) setFile(f);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'students') fd.append(k, JSON.stringify(v));
                else fd.append(k, v);
            });
            if (file) fd.append('pptFile', file);
            if (isEdit) { await updateProject(id, fd); setSuccess('Project updated successfully!'); }
            else { await createProject(fd); setSuccess('Project submitted successfully!'); }
            setTimeout(() => navigate('/projects'), 1200);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save project.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-container">
            <div className="page-header flex items-center gap-3">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
                    <p className="page-subtitle">Fill in the project details below</p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Project Type</div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                            {['Mini', 'Major'].map((t) => (
                                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '14px 28px', borderRadius: 10, border: `2px solid ${form.projectType === t ? 'var(--accent-purple)' : 'var(--border)'}`, background: form.projectType === t ? 'rgba(139,92,246,0.12)' : 'transparent', transition: 'all 0.2s', fontWeight: 700, color: form.projectType === t ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                                    <input type="radio" name="projectType" value={t} checked={form.projectType === t} onChange={(e) => setForm({ ...form, projectType: e.target.value })} style={{ display: 'none' }} />
                                    {t === 'Mini' ? '📗' : '📘'} {t} Project
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Project Details</div>
                        <div className="form-grid form-grid-2">
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Project Title <span>*</span></label>
                                <input className="form-input" placeholder="Enter full project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Domain</label>
                                <select className="form-select" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                                    <option value="">Select domain</option>
                                    {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Submission Date</label>
                                <input type="date" className="form-input" value={form.submissionDate} onChange={(e) => setForm({ ...form, submissionDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Academic Year</label>
                                <input className="form-input" placeholder="e.g. 2024-25" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Batch Year</label>
                                <input className="form-input" placeholder="e.g. 2022-2026" value={form.batchYear} onChange={(e) => setForm({ ...form, batchYear: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Abstract</label>
                                <textarea className="form-textarea" rows="4" placeholder="Brief description of the project..." value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Remarks</label>
                                <textarea className="form-textarea" rows="2" placeholder="Any additional remarks..." value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Guide Assignment</div>
                        <div className="form-grid form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Guide <span>*</span></label>
                                <select className="form-select" value={form.guide} onChange={(e) => setForm({ ...form, guide: e.target.value })} required>
                                    <option value="">Select guide</option>
                                    {guides.map((g) => <option key={g._id} value={g._id}>{g.name} — {g.department || g.email}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Co-Guide (Optional)</label>
                                <select className="form-select" value={form.coGuide} onChange={(e) => setForm({ ...form, coGuide: e.target.value })}>
                                    <option value="">Select co-guide</option>
                                    {guides.map((g) => <option key={g._id} value={g._id}>{g.name} — {g.department || g.email}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">Group Team</div>
                        <div className="form-group">
                            <label className="form-label">Select Groups ({form.students.length} selected)</label>
                            {groups.length === 0 ? (
                                <div className="text-muted">No groups found. <a href="/groups/new" style={{ color: 'var(--accent-purple)' }}>Add groups first →</a></div>
                            ) : (
                                <div className="multi-select-list">
                                    {groups.filter(s => {
                                        if (form.projectType === 'Major') return s.year === 'IV';
                                        if (form.projectType === 'Mini') return s.year === 'III';
                                        return true;
                                    }).map((s) => (
                                        <label key={s._id} className="multi-select-item">
                                            <input type="checkbox" checked={form.students.includes(s._id)} onChange={() => toggleGroup(s._id)} />
                                            <span><strong>{s.name}</strong> &nbsp;|&nbsp; {s.rollNo} &nbsp;|&nbsp; {s.year} Year &nbsp;|&nbsp; {s.department || ''}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-body">
                        <div className="section-title">PPT / Document Upload</div>
                        {existingFile && !file && (
                            <div className="upload-file-name mb-4"><MdInsertDriveFile /> Existing: {existingFile}</div>
                        )}
                        <div className={`upload-zone ${drag ? 'drag' : ''}`}
                            onClick={() => fileRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}>
                            <input type="file" ref={fileRef} accept=".ppt,.pptx,.pdf,.doc,.docx" onChange={(e) => handleFile(e.target.files[0])} />
                            <div className="upload-zone-icon"><MdCloudUpload /></div>
                            <div className="upload-zone-text"><span>Click to upload</span> or drag & drop</div>
                            <div className="upload-zone-accepted">Supported: PPT, PPTX, PDF, DOC, DOCX (max 50 MB)</div>
                        </div>
                        {file && <div className="upload-file-name mt-4"><MdInsertDriveFile /> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><MdSave /> {isEdit ? 'Update Project' : 'Submit Project'}</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
