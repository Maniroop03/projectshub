import { useRef, useState } from 'react';
import { MdClose, MdFileUpload, MdInfo } from 'react-icons/md';
import { formatApiError } from '../api';

export default function BulkImportModal({ isOpen, onClose, onImport, type, fields, sample }) {
    const fileInputRef = useRef(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!text.trim()) return setError('Please paste some data.');
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Handle both Windows (\r\n) and Unix (\n) line endings, skip empty lines
            const lines = text.trim().split(/\r?\n/).filter(l => l.trim() !== '');
            const data = lines.map((line, index) => {
                const values = line.split(',').map(v => v.trim());
                if (values.length < fields.length) {
                    throw new Error(`Line ${index + 1} has only ${values.length} column(s). Expected at least ${fields.length} (${fields.join(', ')}).`);
                }
                const obj = {};
                fields.forEach((f, i) => {
                    obj[f] = values[i] || '';
                });
                return obj;
            });

            await onImport(data);
            setSuccess(`${data.length} record(s) imported successfully!`);
            setText('');
            setTimeout(() => { onClose(); setSuccess(''); }, 1200);
        } catch (err) {
            setError(formatApiError(err, 'Failed to import data.'));
        } finally {
            setLoading(false);
        }
    };

    const handleUseSample = () => {
        setText(sample);
    };

    const handleFile = (file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
            return setError('Please upload a valid CSV file.');
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileText = e.target.result || '';
            setText(fileText);
            setError('');
            setSuccess(`Loaded ${file.name}`);
        };
        reader.onerror = () => {
            setError('Unable to read the selected file.');
        };
        reader.readAsText(file);
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files?.[0];
        if (file) handleFile(file);
        event.target.value = '';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const file = event.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        const header = fields.join(',');
        const sampleLines = sample.trim().split(/\r?\n/).filter(Boolean);
        const csvContent = [header, ...sampleLines].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type.toLowerCase().replace(/\s+/g, '-')}-template.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: 660 }}>
                <div className="modal-header">
                    <h2 className="modal-title">Bulk Add {type}</h2>
                    <button className="btn btn-icon" onClick={onClose}><MdClose /></button>
                </div>
                <div className="modal-body">
                    <div className="alert alert-info flex gap-2 items-start" style={{ alignItems: 'flex-start' }}>
                        <MdInfo style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                            <p><strong>Format:</strong> Comma-separated values, one record per line.</p>
                            <p style={{ marginTop: 4, fontSize: '0.82rem', opacity: 0.85 }}>
                                Columns: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>{fields.join(', ')}</code>
                            </p>
                            <div style={{
                                marginTop: 10,
                                padding: '10px 12px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: 6,
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                color: '#a5b4fc',
                                lineHeight: 1.7,
                            }}>
                                {sample}
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ marginTop: 8, fontSize: '0.75rem', padding: '4px 12px' }}
                                onClick={handleUseSample}
                            >
                                Load Sample into Textarea
                            </button>
                        </div>
                    </div>

                    {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ marginTop: 12 }}>{success}</div>}

                    <div className="form-group" style={{ marginTop: 16 }}>
                        <label className="form-label">Paste Data Here</label>
                        <div
                            className={`drop-zone${dragActive ? ' active' : ''}`}
                            onDragEnter={handleDragOver}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                border: '2px dashed rgba(255,255,255,0.35)',
                                borderRadius: 10,
                                padding: 18,
                                marginBottom: 12,
                                textAlign: 'center',
                                background: dragActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                cursor: 'pointer',
                            }}
                            onClick={openFileSelector}
                        >
                            <p style={{ margin: 0, fontSize: '0.90rem', color: 'var(--text-muted)' }}>
                                Drag & drop a CSV file here, or click to choose a file.
                            </p>
                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ marginTop: 10 }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    openFileSelector();
                                }}
                            >
                                Upload CSV file
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,text/csv"
                                style={{ display: 'none' }}
                                onChange={handleFileInputChange}
                            />
                        </div>
                        <textarea
                            className="form-input"
                            style={{ height: 220, fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6 }}
                            placeholder={`${fields.join(', ')}\n...`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            {text.trim() ? `${text.trim().split(/\r?\n/).filter(l => l.trim()).length} line(s) detected` : 'Paste or type your data above'}
                        </p>
                    </div>
                </div>
                <div className="modal-footer flex gap-3 justify-between" style={{ alignItems: 'center' }}>
                    <button className="btn btn-outline btn-sm" type="button" onClick={handleDownloadTemplate}>
                        Template (.csv)
                    </button>
                    <div className="flex gap-3" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleImport} disabled={loading}>
                            {loading ? 'Importing...' : <><MdFileUpload /> Import {type}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
