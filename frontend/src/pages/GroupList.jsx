import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, deleteGroup, bulkCreateGroups, clearAllGroups, formatApiError } from '../api';
import { MdAdd, MdEdit, MdDelete, MdFileUpload, MdPeople, MdExpandMore, MdExpandLess, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import BulkImportModal from '../components/BulkImportModal';

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [expandedBatches, setExpandedBatches] = useState({});

    const load = () => {
        setLoading(true);
        setError('');
        getGroups()
            .then((r) => setGroups(Array.isArray(r.data) ? r.data : []))
            .catch((err) => { console.error(err); setError(formatApiError(err, 'Failed to load groups.')); })
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete group member "${name}"?`)) return;
        await deleteGroup(id);
        load();
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('Delete ALL groups? This cannot be undone.')) return;
        await clearAllGroups();
        load();
    };

    const handleBulkImport = async (data) => {
        await bulkCreateGroups(data);
        load();
    };

    const toggleBatch = (batchName) => {
        setExpandedBatches(prev => ({ ...prev, [batchName]: !prev[batchName] }));
    };

    // Filter groups by search
    const filtered = groups.filter((s) =>
        search === '' ||
        (s.batch || '').toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.domain || '').toLowerCase().includes(search.toLowerCase())
    );

    // Group by batch, sorted by batch name
    const batches = filtered.reduce((acc, g) => {
        const key = g.batch || 'Ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(g);
        return acc;
    }, {});

    const sortedBatchNames = Object.keys(batches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const totalMembers = groups.length;
    const totalBatches = Object.keys(groups.reduce((acc, g) => { acc[g.batch || 'Ungrouped'] = true; return acc; }, {})).length;

    return (
        <div className="page-container">
            {error && <div className="alert alert-error">{error}</div>}
            {/* Page Header */}
            <div className="page-header flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 className="page-title">Groups</h1>
                    <p className="page-subtitle">{totalBatches} batch(es) · {totalMembers} member(s) registered</p>
                </div>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteAll}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <MdDelete /> Delete All
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => setIsBulkModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <MdFileUpload /> Bulk Add
                    </button>
                    <Link to="/groups/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MdAdd /> Add Batch
                    </Link>
                </div>
            </div>

            <BulkImportModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onImport={handleBulkImport}
                type="Groups"
                fields={['batch', 'role', 'name', 'rollNo', 'section', 'domain', 'phone', 'email']}
                sample={`Batch 1, Lead, CHETLA AKSHITHA, 237Z1A6729, A, AI and Robotics, 9876543210, akshitha@example.com
Batch 1, Member, KANUGANTI RUSHIKESH, 237Z1A6757, A, AI and Robotics, , 
Batch 1, Member, KOLIPAKA RADHIKA, 237Z1A6759, A, AI and Robotics, , `}
            />

            {/* Search Bar */}
            <div className="filter-bar" style={{ marginBottom: 20 }}>
                <input
                    className="form-input"
                    style={{ maxWidth: 360 }}
                    placeholder="🔍 Search batch, name, roll no, domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {filtered.length !== groups.length && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {sortedBatchNames.length} batch(es) shown
                    </span>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-center"><div className="loading-spinner" /></div>
            ) : groups.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <p>No groups found.</p>
                    <Link to="/groups/new" className="btn btn-primary mt-4"><MdAdd /> Add Group</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {sortedBatchNames.map((batchName, bIdx) => {
                        const members = batches[batchName];
                        const lead = members.find(m => m.role === 'Lead') || members[0];
                        const memberCount = members.filter(m => m.role === 'Member').length;
                        const isExpanded = expandedBatches[batchName] === true;
                        const domain = lead?.domain || '—';

                        return (
                            <div key={batchName} className="card" style={{ overflow: 'hidden' }}>
                                {/* Batch Header Row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 24px',
                                    cursor: 'pointer',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                }}>
                                    {/* Left: Batch label + lead info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span style={{
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            minWidth: 60,
                                        }}>
                                            Batch {bIdx + 1}
                                        </span>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <MdPeople style={{ color: 'var(--accent-purple)' }} />
                                                <strong style={{ fontSize: '1rem', letterSpacing: 0.5 }}>
                                                    {lead?.name?.toUpperCase()}
                                                </strong>
                                                <span style={{
                                                    background: 'rgba(139,92,246,0.18)',
                                                    color: 'var(--accent-purple)',
                                                    borderRadius: 6,
                                                    padding: '2px 10px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 700,
                                                    letterSpacing: 1,
                                                }}>LEAD</span>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2, display: 'flex', gap: 10 }}>
                                                <span>{lead?.rollNo}</span>
                                                {memberCount > 0 && (
                                                    <span>👥 +{memberCount} team member{memberCount > 1 ? 's' : ''}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Domain badge + toggle button */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span className="badge badge-mini" style={{
                                            background: 'rgba(139,92,246,0.15)',
                                            color: 'var(--accent-purple)',
                                            border: '1px solid rgba(139,92,246,0.3)',
                                            padding: '5px 14px',
                                            borderRadius: 20,
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                        }}>
                                            {domain}
                                        </span>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => toggleBatch(batchName)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 80 }}
                                        >
                                            {isExpanded ? (
                                                <><MdExpandLess /> Hide</>
                                            ) : (
                                                <><MdVisibility /> View</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Team Table */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--border)', padding: '0 0 16px 0' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '14px 24px 10px',
                                            color: 'var(--accent-purple)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}>
                                            <MdPeople />
                                            Team Members — {batchName}
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                                                {members.length} member{members.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="table-wrapper" style={{ margin: '0 16px', borderRadius: 10 }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>ROLE</th>
                                                        <th>NAME</th>
                                                        <th>ROLL NO</th>
                                                        <th>SECTION</th>
                                                        <th>DOMAIN</th>
                                                        <th>PHONE</th>
                                                        <th>EMAIL</th>
                                                        <th>ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {members
                                                        .sort((a, b) => (a.role === 'Lead' ? -1 : 1))
                                                        .map((m, idx) => (
                                                            <tr key={m._id}>
                                                                <td>{idx + 1}</td>
                                                                <td>
                                                                    <span style={{
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 700,
                                                                        letterSpacing: 0.8,
                                                                        color: m.role === 'Lead' ? 'var(--accent-purple)' : 'var(--text-muted)',
                                                                        textTransform: 'uppercase',
                                                                    }}>
                                                                        {m.role}
                                                                    </span>
                                                                </td>
                                                                <td><strong>{m.name?.toUpperCase()}</strong></td>
                                                                <td>{m.rollNo}</td>
                                                                <td>{m.section || '—'}</td>
                                                                <td>
                                                                    {m.domain ? (
                                                                        <span className="badge badge-mini" style={{
                                                                            background: 'rgba(139,92,246,0.12)',
                                                                            color: 'var(--accent-purple)',
                                                                            border: '1px solid rgba(139,92,246,0.25)',
                                                                            padding: '3px 10px',
                                                                            borderRadius: 12,
                                                                            fontSize: '0.75rem',
                                                                        }}>
                                                                            {m.domain}
                                                                        </span>
                                                                    ) : '—'}
                                                                </td>
                                                                <td>{m.phone || '—'}</td>
                                                                <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {m.email || '—'}
                                                                </td>
                                                                <td>
                                                                    <div className="flex gap-2">
                                                                        <Link
                                                                            to={`/groups/${m._id}/edit`}
                                                                            className="btn btn-outline btn-sm"
                                                                            title="Edit"
                                                                        >
                                                                            <MdEdit />
                                                                        </Link>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            title="Delete"
                                                                            onClick={() => handleDelete(m._id, m.name)}
                                                                        >
                                                                            <MdDelete />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
