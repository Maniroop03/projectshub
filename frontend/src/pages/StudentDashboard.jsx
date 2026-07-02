import { useEffect, useState } from 'react';
import { getProjects, formatApiError } from '../api';
import { MdFileDownload, MdPerson, MdGroup, MdCheckCircle, MdPendingActions, MdEdit } from 'react-icons/md';

const statusBadge = (status) => {
    const map = {
        'Submitted': { badge: 'submitted', icon: '📤', label: 'Submitted' },
        'Under Review': { badge: 'review', icon: '🔍', label: 'Under Review' },
        'Approved': { badge: 'approved', icon: '✅', label: 'Approved' },
        'Rejected': { badge: 'rejected', icon: '❌', label: 'Rejected' },
        'Completed': { badge: 'completed', icon: '🏆', label: 'Completed' }
    };
    const info = map[status] || { badge: 'submitted', icon: '📝', label: status };
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '1.2rem' }}>{info.icon}</span>
            <span className={`badge badge-${info.badge}`}>{info.label}</span>
        </div>
    );
};

const FileDownloadButton = ({ fileUrl, fileName, label = 'Download' }) => {
    if (!fileUrl) {
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not provided</span>;
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Failed to download file');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    return (
        <button
            onClick={handleDownload}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                background: 'var(--accent-purple)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = 0.8}
            onMouseLeave={(e) => e.target.style.opacity = 1}
        >
            <MdFileDownload /> {label}
        </button>
    );
};

const ProjectCard = ({ project, groupAuth }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            marginBottom: 24,
            border: '1px solid #eee',
            transition: 'box-shadow 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
        >
            {/* Header with Title and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                        {project.title}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {project.projectType} Project • {project.domain || 'General'}
                    </p>
                </div>
                <div>
                    {statusBadge(project.status)}
                </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
                {/* Guide Info */}
                <div style={{ background: '#f8f7ff', padding: 16, borderRadius: 8, border: '1px solid #e9e7f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MdPerson style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Guide</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                        {project.guide?.name || 'Not assigned'}
                    </p>
                </div>

                {/* Group Info */}
                <div style={{ background: '#f0f8ff', padding: 16, borderRadius: 8, border: '1px solid #e0f0ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MdGroup style={{ color: '#0066cc', fontSize: '1.2rem' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Group</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                        {groupAuth?.batch || 'N/A'} - {groupAuth?.section || 'N/A'}
                    </p>
                </div>

                {/* Submission Date */}
                <div style={{ background: '#f0fff4', padding: 16, borderRadius: 8, border: '1px solid #e0f7e0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>📅 Submitted</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                        {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not submitted'}
                    </p>
                </div>
            </div>

            {/* Team Members */}
            {groupAuth?.members && groupAuth.members.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        👥 Team Members
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {groupAuth.members.map((member) => (
                            <div key={member._id || member.rollNo} style={{
                                background: '#fafafa',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid #e0e0e0',
                                fontSize: '0.9rem'
                            }}>
                                <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                                    {member.name || 'Member'}
                                </p>
                                <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {member.rollNo || 'N/A'}
                                </p>
                                {member.role && (
                                    <p style={{ margin: 0, background: 'var(--accent-purple)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', width: 'fit-content', fontWeight: 600 }}>
                                        {member.role}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Abstract */}
            {project.abstract && (
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        📋 Abstract
                    </h3>
                    <div style={{
                        background: '#f9f9f9',
                        padding: 16,
                        borderRadius: 8,
                        border: '1px solid #e8e8e8',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {project.abstract}
                    </div>
                </div>
            )}

            {/* File Downloads */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        📄 Abstract (PDF)
                    </label>
                    <FileDownloadButton
                        fileUrl={project.abstractFile}
                        fileName={`${project.title}-abstract.pdf`}
                        label="Download Abstract"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        📑 Project Report (PDF)
                    </label>
                    <FileDownloadButton
                        fileUrl={project.reportFile}
                        fileName={`${project.title}-report.pdf`}
                        label="Download Report"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        💾 Source Code (ZIP)
                    </label>
                    <FileDownloadButton
                        fileUrl={project.sourceCodeFile}
                        fileName={`${project.title}-source.zip`}
                        label="Download Code"
                    />
                </div>
            </div>
        </div>
    );
};

export default function StudentDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('mini');
    const [groupAuth, setGroupAuth] = useState(null);

    const getGroupAuth = () => {
        try {
            const g = localStorage.getItem('group_auth');
            return g ? JSON.parse(g) : null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const auth = getGroupAuth();
        setGroupAuth(auth);

        if (!auth) {
            setError('Not logged in as a group member.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        getProjects({ batch: auth.batch })
            .then((r) => {
                const projectsList = Array.isArray(r.data) ? r.data : [];
                setProjects(projectsList);
            })
            .catch((err) => {
                console.error('Projects fetch error:', err);
                setError(formatApiError(err, 'Failed to load projects.'));
            })
            .finally(() => setLoading(false));
    }, []);

    const miniProjects = projects.filter(p => p.projectType === 'Mini');
    const majorProjects = projects.filter(p => p.projectType === 'Major');
    const activeProjects = activeTab === 'mini' ? miniProjects : majorProjects;

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 700 }}>
                    📚 My Projects
                </h1>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
                    View and manage your group's mini and major projects
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    {(() => {
                        try {
                            return String(error).trim() || 'An error occurred. Please try again.';
                        } catch {
                            return 'An error occurred. Please try again.';
                        }
                    })()}
                </div>
            )}

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 16,
                marginBottom: 32,
                borderBottom: '2px solid #e8e8e8'
            }}>
                <button
                    onClick={() => setActiveTab('mini')}
                    style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'mini' ? '3px solid var(--accent-purple)' : 'none',
                        color: activeTab === 'mini' ? 'var(--accent-purple)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'mini' ? 600 : 500,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    🎯 Mini Projects ({miniProjects.length})
                </button>
                <button
                    onClick={() => setActiveTab('major')}
                    style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'major' ? '3px solid var(--accent-purple)' : 'none',
                        color: activeTab === 'major' ? 'var(--accent-purple)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'major' ? 600 : 500,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    🏆 Major Projects ({majorProjects.length})
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && activeProjects.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: '#f9f9f9',
                    borderRadius: 12,
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>
                        {activeTab === 'mini' ? '🎯' : '🏆'}
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                        No {activeTab === 'mini' ? 'Mini' : 'Major'} Projects
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                        Your group hasn't submitted any {activeTab === 'mini' ? 'mini' : 'major'} projects yet.
                    </p>
                </div>
            )}

            {/* Projects Grid */}
            {!loading && activeProjects.length > 0 && (
                <div>
                    {activeProjects.map((project) => (
                        <ProjectCard key={project._id} project={project} groupAuth={groupAuth} />
                    ))}
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: 48,
                padding: '24px',
                background: '#f9f9f9',
                borderRadius: 8,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}>
                Developed & Maintained by <strong>Mrs. Priyanka Pandarinath</strong>, Assistant Professor
            </div>
        </div>
    );
}
