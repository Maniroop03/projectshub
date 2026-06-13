import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGroup, updateGroup, getGroup } from '../api';
import { DOMAINS } from '../data/domains';
import { MdSave, MdArrowBack } from 'react-icons/md';

export default function GroupForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({
  batch: '',
  section: '',
  domain: '',
  members: [
    {
      role: 'Lead',
      name: '',
      rollNo: '',
      email: '',
      phone: ''
    }
  ]
});
const addMember = () => {
  setForm({
    ...form,
    members: [
      ...form.members,
      {
        role: 'Member',
        name: '',
        rollNo: '',
        email: '',
        phone: ''
      }
    ]
  });
};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) getGroup(id).then((r) => setForm(r.data)).catch(console.error);
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEdit) await updateGroup(id, form);
            else await createGroup(form);
            navigate('/groups');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save group.');
        } finally { setLoading(false); }
    };

    const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

    return (
        <div className="page-container">
            <div className="page-header flex items-center gap-3">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><MdArrowBack /> Back</button>
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Batch' : 'Add Batch'}</h1>
                    <p className="page-subtitle">Student registration details</p>
                </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid form-grid-2">

  <div className="form-group">
    <label className="form-label">Batch No</label>
    <input
      className="form-input"
      placeholder="Batch 32"
      value={form.batch}
      onChange={(e) =>
        setForm({ ...form, batch: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label className="form-label">Section</label>
    <input
      className="form-input"
      placeholder="A"
      value={form.section}
      onChange={(e) =>
        setForm({ ...form, section: e.target.value })
      }
    />
  </div>

  <div
    className="form-group"
    style={{ gridColumn: '1 / -1' }}
  >
    <label className="form-label">Domain</label>

    <select
      className="form-select"
      value={form.domain}
      onChange={(e) =>
        setForm({ ...form, domain: e.target.value })
      }
    >
      <option value="">
        — Select a domain —
      </option>

      {DOMAINS.map((domain) => (
        <option
          key={domain.id}
          value={domain.name}
        >
          {domain.name}
        </option>
      ))}
    </select>
  </div>

</div>
<h3 style={{ marginTop: 30 }}>
  Group Members
</h3>

{form.members.map((member, index) => (
  <div
    key={index}
    className="card"
    style={{ marginTop: 20 }}
  >
    <div className="card-body">

      <h4>
        Member {index + 1}
      </h4>

      <div className="form-grid form-grid-2">

        <div className="form-group">
          <label>Name</label>

          <input
            className="form-input"
            value={member.name}
            onChange={(e) => {
              const updated = [...form.members];
              updated[index].name =
                e.target.value;

              setForm({
                ...form,
                members: updated
              });
            }}
          />
        </div>

        <div className="form-group">
          <label>Roll No</label>

          <input
            className="form-input"
            value={member.rollNo}
            onChange={(e) => {
              const updated = [...form.members];
              updated[index].rollNo =
                e.target.value;

              setForm({
                ...form,
                members: updated
              });
            }}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            className="form-input"
            value={member.email}
            onChange={(e) => {
              const updated = [...form.members];
              updated[index].email =
                e.target.value;

              setForm({
                ...form,
                members: updated
              });
            }}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>

          <input
            className="form-input"
            value={member.phone}
            onChange={(e) => {
              const updated = [...form.members];
              updated[index].phone =
                e.target.value;

              setForm({
                ...form,
                members: updated
              });
            }}
          />
        </div>

      </div>
    </div>
  </div>
))}
                        <div className="flex gap-3 mt-4">
                            <button
  type="button"
  className="btn btn-outline"
  onClick={addMember}
>
  + Add Member
</button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><MdSave /> {isEdit ? 'Update Batch' : 'Add Batch'}</>}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
