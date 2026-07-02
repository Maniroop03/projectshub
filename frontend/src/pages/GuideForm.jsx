import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGuide, updateGuide, getGuide } from '../api';
import { MdSave, MdArrowBack } from 'react-icons/md';

const DEPTS = ['Computer Science', 'Data Science', 'Information Technology', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Mathematics', 'Physics', 'Other'];

export default function GuideForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '', email: '', department: '', domain: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) getGuide(id).then((r) => setForm(r.data)).catch(console.error);
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEdit) await updateGuide(id, form);
            else await createGuide(form);
            navigate('/guides');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save guide.');
        } finally { setLoading(false); }
    };

    const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

    return (
        <div className="page-container">
            <div className="page-header flex items-center gap-3">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Guide' : 'Add Guide'}</h1>
                    <p className="page-subtitle">Guide / Faculty details</p>
                </div>
            </div>
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
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-info" style={{ marginBottom: 20 }}>
                        📱 The <strong>phone number</strong> is used to send WhatsApp notifications when a project is assigned to this guide.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name <span>*</span></label>
                                <input className="form-input" placeholder="Dr. / Mrs. / Mr. ..." required {...f('name')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number <span>*</span></label>
                                <input className="form-input" type="tel" placeholder="10-digit WhatsApp number" required {...f('phone')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="guide@college.edu" {...f('email')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select className="form-select" {...f('department')}>
                                    <option value="">Select department</option>
                                    {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Domain</label>
                                <input className="form-input" placeholder="e.g. Cybersecurity, IoT" {...f('domain')} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><MdSave /> {isEdit ? 'Update' : 'Add Guide'}</>}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
