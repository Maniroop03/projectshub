import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, updateStudent, getStudent } from '../api';
import { MdSave, MdArrowBack } from 'react-icons/md';

const YEARS = ['I', 'II', 'III', 'IV'];
const DEPTS = ['Computer Science', 'Data Science', 'Information Technology', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];

export default function StudentForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', rollNo: '', year: 'III', section: '', department: '', email: '', phone: '', domain: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) getStudent(id).then((r) => setForm(r.data)).catch(console.error);
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEdit) await updateStudent(id, form);
            else await createStudent(form);
            navigate('/students');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save student.');
        } finally { setLoading(false); }
    };

    const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

    return (
        <div className="page-container">
            <div className="page-header flex items-center gap-3">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Student' : 'Add Student'}</h1>
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
                                <label className="form-label">Year <span>*</span></label>
                                <select className="form-select" required {...f('year')}>
                                    {YEARS.map((y) => <option key={y} value={y}>{y} Year</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <input className="form-input" placeholder="e.g. A" {...f('section')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select className="form-select" {...f('department')}>
                                    <option value="">Select department</option>
                                    {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="student@college.edu" {...f('email')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" type="tel" placeholder="10-digit mobile" {...f('phone')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Domain</label>
                                <input className="form-input" placeholder="e.g. AI/ML, Web Dev" {...f('domain')} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><MdSave /> {isEdit ? 'Update' : 'Add Student'}</>}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
