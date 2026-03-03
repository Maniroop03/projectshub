import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdPerson, MdSchool } from 'react-icons/md';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(() => {
            if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
                localStorage.setItem('admin_auth', 'true');
                navigate('/dashboard');
            } else {
                setError('Invalid username or password.');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎓</div>
                <h1>Project Hub</h1>
                <p>Student Project Management System<br />Enter your credentials to continue</p>

                {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><MdLock /> {error}</div>}

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
                    Default: <code style={{ color: 'var(--accent-purple)' }}>admin</code> / <code style={{ color: 'var(--accent-purple)' }}>admin123</code>
                </div>
                <div className="footer-bar" style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 16, background: 'none' }}>
                    Developed and Maintained by<br />
                    <strong>Mrs. Priyanka Pandarinath</strong>, Assistant Professor
                </div>
            </div>
        </div>
    );
}
