import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGroups, deleteGroup, bulkCreateGroups } from '../api';
import { MdAdd, MdEdit, MdDelete, MdFileUpload } from 'react-icons/md';
import BulkImportModal from '../components/BulkImportModal';

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const navigate = useNavigate();

    const load = () => { setLoading(true); getGroups().then((r) => setGroups(r.data)).catch(console.error).finally(() => setLoading(false)); };
    useEffect(load, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete group "${name}"?`)) return;
        await deleteGroup(id); load();
    };

    const handleBulkImport = async (data) => {
        await bulkCreateGroups(data);
        load();
    };

    const filtered = groups.filter((s) =>
        search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Groups</h1>
                    <p className="page-subtitle">{groups.length} group(s) registered</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => setIsBulkModalOpen(true)}><MdFileUpload /> Bulk Add</button>
                    <Link to="/groups/new" className="btn btn-primary"><MdAdd /> Add Group</Link>
                </div>
            </div>

            <BulkImportModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onImport={handleBulkImport}
                type="Groups"
                fields={['name', 'rollNo', 'year', 'section', 'department', 'email', 'phone', 'domain']}
                sample="John Doe, 22CS001, III, A, Computer Science, john@example.com, 1234567890, AI/ML"
            />
            <div className="filter-bar">
                <input className="form-input" style={{ maxWidth: 300 }} placeholder="🔍 Search name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {loading ? <div className="loading-center"><div className="loading-spinner" /></div> : filtered.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">👥</div><p>No groups found.</p><Link to="/groups/new" className="btn btn-primary mt-4"><MdAdd /> Add Group</Link></div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Year</th><th>Section</th><th>Department</th><th>Domain</th><th>Phone</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s._id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{s.name}</strong></td>
                                    <td>{s.rollNo}</td>
                                    <td>{s.year}</td>
                                    <td>{s.section || '—'}</td>
                                    <td>{s.department || '—'}</td>
                                    <td><span className="badge badge-mini">{s.domain || '—'}</span></td>
                                    <td>{s.phone || '—'}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link to={`/groups/${s._id}/edit`} className="btn btn-outline btn-sm"><MdEdit /></Link>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id, s.name)}><MdDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
