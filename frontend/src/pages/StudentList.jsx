import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../api';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const load = () => { setLoading(true); getStudents().then((r) => setStudents(r.data)).catch(console.error).finally(() => setLoading(false)); };
    useEffect(load, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete student "${name}"?`)) return;
        await deleteStudent(id); load();
    };

    const filtered = students.filter((s) =>
        search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">{students.length} student(s) registered</p>
                </div>
                <Link to="/students/new" className="btn btn-primary"><MdAdd /> Add Student</Link>
            </div>
            <div className="filter-bar">
                <input className="form-input" style={{ maxWidth: 300 }} placeholder="🔍 Search name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {loading ? <div className="loading-center"><div className="loading-spinner" /></div> : filtered.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">👥</div><p>No students found.</p><Link to="/students/new" className="btn btn-primary mt-4"><MdAdd /> Add Student</Link></div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Year</th><th>Section</th><th>Department</th><th>Phone</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s._id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{s.name}</strong></td>
                                    <td>{s.rollNo}</td>
                                    <td>{s.year}</td>
                                    <td>{s.section || '—'}</td>
                                    <td>{s.department || '—'}</td>
                                    <td>{s.phone || '—'}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link to={`/students/${s._id}/edit`} className="btn btn-outline btn-sm"><MdEdit /></Link>
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
