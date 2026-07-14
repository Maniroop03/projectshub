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

const AddFileButton = ({ label = 'Add File', onAdd }) => {
    const handleClick = () => {
        if (onAdd) onAdd();
        else alert(`Add ${label} functionality coming soon!`);
    };

    return (
        <button
            onClick={handleClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--accent-purple)',
                border: '1px solid var(--accent-purple)',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            + ADD
        </button>
    );
};

const ProjectCard = ({ project, groupAuth }) => {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            marginBottom: 24,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }}
        >
            {/* Header with Title and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {project.title}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
                <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: 16, borderRadius: 8, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MdPerson style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Guide</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {project.guide?.name || 'Not assigned'}
                    </p>
                </div>

                {/* Group Info */}
                <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: 16, borderRadius: 8, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MdGroup style={{ color: 'var(--accent-indigo)', fontSize: '1.2rem' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Group</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {groupAuth?.batch || 'N/A'} - {groupAuth?.section || 'N/A'}
                    </p>
                </div>

                {/* Submission Date */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: 16, borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📅 Submitted</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
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
                                background: 'rgba(255, 255, 255, 0.04)',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            }}
                            >
                                <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {member.name || 'Member'}
                                </p>
                                <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
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
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: 16,
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.06)',
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            📄 Abstract (PDF)
                        </label>
                        <AddFileButton label="Abstract PDF" />
                    </div>
                    <FileDownloadButton
                        fileUrl={project.abstractFile}
                        fileName={`${project.title}-abstract.pdf`}
                        label="Download Abstract"
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            📑 Project Report (PDF)
                        </label>
                        <AddFileButton label="Project Report PDF" />
                    </div>
                    <FileDownloadButton
                        fileUrl={project.reportFile}
                        fileName={`${project.title}-report.pdf`}
                        label="Download Report"
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            💾 Source Code (ZIP)
                        </label>
                        <AddFileButton label="Source Code ZIP" />
                    </div>
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
    const getGroupAuth = () => {
        try {
            const g = localStorage.getItem('group_auth');
            return g ? JSON.parse(g) : null;
        } catch {
            return null;
        }
    };

    const initialAuth = getGroupAuth();

    const [groupAuth] = useState(initialAuth);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(!!initialAuth);
    const [error, setError] = useState(initialAuth ? '' : 'Not logged in as a group member.');
    const [activeTab, setActiveTab] = useState('mini');

    useEffect(() => {
        if (!groupAuth) return;

        getProjects({ batch: groupAuth.batch })
            .then((r) => {
                const projectsList = Array.isArray(r.data) ? r.data : [];
                setProjects(projectsList);
            })
            .catch((err) => {
                console.error('Projects fetch error:', err);
                setError(formatApiError(err, 'Failed to load projects.'));
            })
            .finally(() => setLoading(false));
    }, [groupAuth]);

    const miniProjects = projects.filter(p => p.projectType === 'Mini');
    const majorProjects = projects.filter(p => p.projectType === 'Major');
    const activeProjects = activeTab === 'mini' ? miniProjects : majorProjects;

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    📚 My Projects
                </h1>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <button
                    onClick={() => setActiveTab('mini')}
                    style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'mini' ? '3px solid var(--accent-purple)' : 'none',
                        color: activeTab === 'mini' ? 'var(--accent-purple)' : 'var(--text-secondary)',
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
                        color: activeTab === 'major' ? 'var(--accent-purple)' : 'var(--text-secondary)',
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
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>
                        {activeTab === 'mini' ? '🎯' : '🏆'}
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No {activeTab === 'mini' ? 'Mini' : 'Major'} Projects
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
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
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 8,
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
                Developed & Maintained by <strong>Mrs. Priyanka Pandarinath</strong>, Assistant Professor
            </div>
        </div>
    );
}
