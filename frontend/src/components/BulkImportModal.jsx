import { useState } from 'react';
import { MdClose, MdFileUpload, MdInfo } from 'react-icons/md';

export default function BulkImportModal({ isOpen, onClose, onImport, type, fields, sample }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!text.trim()) return setError('Please paste some data.');
        setLoading(true);
        setError('');

        try {
            const lines = text.trim().split('\n');
            const data = lines.map((line, index) => {
                const values = line.split(',').map(v => v.trim());
                if (values.length < fields.length) {
                    throw new Error(`Line ${index + 1} has insufficient columns. Expected at least ${fields.length}.`);
                }
                const obj = {};
                fields.forEach((f, i) => {
                    obj[f] = values[i];
                });
                return obj;
            });

            await onImport(data);
            setText('');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to parse data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: 600 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Bulk Add {type}</h2>
                    <button className="btn btn-icon" onClick={onClose}><MdClose /></button>
                </div>
                <div className="modal-body">
                    <div className="alert alert-info flex gap-2 items-start">
                        <MdInfo className="mt-1" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                        <div>
                            <p><strong>Format:</strong> Comma-separated values (one record per line).</p>
                            <p className="mt-1 text-sm opacity-80">Columns: {fields.join(', ')}</p>
                            <div className="mt-2 p-2 bg-black bg-opacity-10 rounded font-mono text-xs">
                                {sample}
                            </div>
                        </div>
                    </div>

                    {error && <div className="alert alert-error mt-4">{error}</div>}

                    <div className="form-group mt-4">
                        <label className="form-label">Paste Data Here</label>
                        <textarea
                            className="form-input"
                            style={{ height: 250, fontFamily: 'monospace', fontSize: '14px' }}
                            placeholder="John Doe, 22CS001, III, A, Computer Science, john@example.com, 10-digit mobile"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-footer flex gap-3 justify-end">
                    <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleImport} disabled={loading}>
                        {loading ? 'Importing...' : <><MdFileUpload /> Import {type}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
