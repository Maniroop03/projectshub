import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdPerson, MdSchool } from 'react-icons/md';
import { groupLogin, formatApiError } from '../api';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Group login behavior: username = rollNo, password = rollNo (default)
export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Clear any stale errors on component mount
    useEffect(() => {
        setError('');
        setForm({ username: '', password: '' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Admin shortcut (keeps previous behavior)
        if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
            localStorage.setItem('admin_auth', 'true');
            // Store admin secret for API requests (set via VITE_ADMIN_SECRET in production)
            const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'admin123';
            try { localStorage.setItem('admin_secret', adminSecret); } catch {}
            navigate('/dashboard');
            return;
        }

        try {
            // Try group login via API
            const res = await groupLogin({ rollNo: form.username, password: form.password });
            const match = res.data;
            if (match && match._id) {
                localStorage.setItem('group_auth', JSON.stringify({
                    id: match._id,
                    rollNo: match.rollNo,
                    batch: match.batch,
                    section: match.section || '',
                    domain: match.domain || '',
                    year: match.year || '',
                    department: match.department || '',
                    members: Array.isArray(match.members) ? match.members : []
                }));
                navigate('/projects');
                return;
            }

            setError('Invalid username or password.');
        } catch (err) {
            console.error('Group login error:', err);
            const errorMsg = formatApiError(err, 'Group login failed.');
            console.log('Formatted error message:', errorMsg, 'Type:', typeof errorMsg);
            // Ensure error is always a string
            const finalError = String(errorMsg || 'An error occurred. Please try again.');
            setError(finalError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎓</div>
                <h1>Project Hub</h1>
                <p>Group Project Management System<br />Enter your credentials to continue</p>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 20 }}>
                        <MdLock /> 
                        {(() => {
                            try {
                                const errorText = String(error).trim() || 'An error occurred. Please try again.';
                                return errorText;
                            } catch {
                                return 'An error occurred. Please try again.';
                            }
                        })()}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Username <span>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <MdPerson style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: 38 }}
                                placeholder="Enter username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 28 }}>
                        <label className="form-label">Password <span>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <MdLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: 38 }}
                                type="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
                        {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : <><MdSchool /> Sign In</>}
                    </button>
                </form>

                <div className="mt-4 text-muted text-center" style={{ fontSize: '0.78rem', marginTop: 24 }}>
                    Default admin login: <code style={{ color: 'var(--accent-purple)' }}>admin</code> / <code style={{ color: 'var(--accent-purple)' }}>admin123</code>
                </div>
                <div className="mt-2 text-muted text-center" style={{ fontSize: '0.78rem' }}>
                    Group login uses the batch lead's roll number as both username and password.
                </div>
                <div className="footer-bar" style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 16, background: 'none' }}>
                    Developed and Maintained by<br />
                    <strong>Mrs. Priyanka Pandarinath</strong>, Assistant Professor
                </div>
            </div>
        </div>
    );
}
