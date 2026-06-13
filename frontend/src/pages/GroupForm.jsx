import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGroup, updateGroup, getGroup } from '../api';
import { DOMAINS } from '../data/domains';
import { MdSave, MdArrowBack } from 'react-icons/md';

export default function GroupForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ batch: '', name: '', rollNo: '', section: '', email: '', phone: '', domain: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) getGroup(id).then((r) => setForm(r.data)).catch(console.error);
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEdit) await updateGroup(id, form);
            else await createGroup(form);
            navigate('/groups');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save group.');
        } finally { setLoading(false); }
    };

    const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

    return (
        <div className="page-container">
            <div className="page-header flex items-center gap-3">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Batch' : 'Add Batch'}</h1>
                    <p className="page-subtitle">Student registration details</p>
                </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name <span>*</span></label>
                                <input className="form-input" placeholder="Student full name" required {...f('name')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Roll Number <span>*</span></label>
                                <input className="form-input" placeholder="e.g. 22CS001" required {...f('rollNo')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Batch No</label>
                                <input className="form-input" placeholder="Batch 32" {...f('batch')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <input className="form-input" placeholder="e.g. A" {...f('section')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="student@college.edu" {...f('email')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" type="tel" placeholder="10-digit mobile" {...f('phone')} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Domain</label>
                                <select className="form-select" {...f('domain')}>
                                    <option value="">— Select a domain —</option>
                                    {DOMAINS.map((domain) => (
                                        <option key={domain.id} value={domain.name}>{domain.name}</option>
                                    ))}
                                </select>
                                <p style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    💡 Visit the Domains tab to explore each domain before choosing.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><MdSave /> {isEdit ? 'Update Batch' : 'Add Batch'}</>}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
