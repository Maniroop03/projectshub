import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGuides, deleteGuide, bulkCreateGuides } from '../api';
import { MdAdd, MdEdit, MdDelete, MdWhatsapp, MdFileUpload } from 'react-icons/md';
import BulkImportModal from '../components/BulkImportModal';

export default function GuideList() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const load = () => { setLoading(true); getGuides().then((r) => setGuides(r.data)).catch(console.error).finally(() => setLoading(false)); };
    useEffect(load, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete guide "${name}"?`)) return;
        await deleteGuide(id); load();
    };

    const handleBulkImport = async (data) => {
        await bulkCreateGuides(data);
        load();
    };

    const filtered = guides.filter((g) =>
        search === '' || g.name.toLowerCase().includes(search.toLowerCase()) || (g.department || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Guides / Faculty</h1>
                    <p className="page-subtitle">{guides.length} guide(s) registered</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => setIsBulkModalOpen(true)}><MdFileUpload /> Bulk Add</button>
                    <Link to="/guides/new" className="btn btn-primary"><MdAdd /> Add Guide</Link>
                </div>
            </div>

            <BulkImportModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onImport={handleBulkImport}
                type="Guides"
                fields={['name', 'phone', 'email', 'department', 'domain']}
                sample="Dr. Smith, 1234567890, smith@example.com, Computer Science, AI/ML"
            />
            <div className="filter-bar">
                <input className="form-input" style={{ maxWidth: 300 }} placeholder="🔍 Search name or department..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {loading ? <div className="loading-center"><div className="loading-spinner" /></div> : filtered.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">👨‍🏫</div><p>No guides found.</p><Link to="/guides/new" className="btn btn-primary mt-4"><MdAdd /> Add Guide</Link></div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Department</th><th>Domain</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((g, i) => (
                                <tr key={g._id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{g.name}</strong></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {g.phone}
                                            {g.phone && (
                                                <a
                                                    href={`https://wa.me/91${g.phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Open WhatsApp"
                                                    style={{ color: '#25d366', fontSize: '1.1rem', display: 'flex' }}
                                                ><MdWhatsapp /></a>
                                            )}
                                        </div>
                                    </td>
                                    <td>{g.email || '—'}</td>
                                    <td>{g.department || '—'}</td>
                                    <td><span className="badge badge-mini">{g.domain || '—'}</span></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link to={`/guides/${g._id}/edit`} className="btn btn-outline btn-sm"><MdEdit /></Link>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g._id, g.name)}><MdDelete /></button>
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
