import { useState } from 'react';
import { MdLanguage, MdMemory, MdIntegrationInstructions, MdOutlineAutoAwesomeMotion } from 'react-icons/md';

const DOMAINS = [
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    icon: <MdLanguage size={26} />,
    description: 'Teaching machines to read, understand, and generate human language for intelligent applications.',
    applications: [
      'Chatbots & Virtual Assistants',
      'Machine Translation',
      'Text Summarization',
      'Named Entity Recognition',
    ],
    projects: [
      'Sentiment analysis on social media',
      'Automatic text summarizer',
      'Question answering system',
    ],
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    icon: <MdOutlineAutoAwesomeMotion size={26} />,
    description: 'Neural networks that mimic the human brain to solve complex tasks such as vision and language.',
    applications: [
      'Image classification',
      'Speech recognition',
      'Anomaly detection',
    ],
    projects: [
      'Image recognition system',
      'Voice-based assistant',
      'Predictive maintenance model',
    ],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: <MdIntegrationInstructions size={26} />,
    description: 'Systems that learn from data and improve over time for smarter decision-making.',
    applications: [
      'Recommendation engines',
      'Fraud detection',
      'Predictive analytics',
    ],
    projects: [
      'Student performance predictor',
      'Course recommendation system',
      'Sales forecasting dashboard',
    ],
  },
];

export default function Domains() {
  const [selected, setSelected] = useState(DOMAINS[0].id);
  const current = DOMAINS.find((d) => d.id === selected) || DOMAINS[0];

  return (
    <div className="page-container">
      <div className="page-header flex items-center gap-3" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Explore Domains</h1>
          <p className="page-subtitle">Browse available project domains and pick the right one for your team.</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="section-title">Select a domain</div>
              <p className="text-muted">Choose from popular project domains and view sample applications.</p>
            </div>
            <div style={{ minWidth: 240 }}>
              <input
                type="search"
                className="form-input"
                placeholder="Search domains..."
                onChange={(e) => {
                  const query = e.target.value.toLowerCase();
                  const match = DOMAINS.find((d) => d.name.toLowerCase().includes(query));
                  if (match) setSelected(match.id);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {DOMAINS.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => setSelected(domain.id)}
              className={`card ${selected === domain.id ? 'active' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 20,
                textAlign: 'left',
                border: selected === domain.id ? '1px solid var(--accent-purple)' : undefined,
              }}
            >
              <div style={{ marginBottom: 18 }}>{domain.icon}</div>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{domain.name}</h2>
              <p className="text-muted" style={{ marginTop: 10 }}>{domain.description}</p>
            </button>
          ))}
        </div>

        <div className="card" style={{ minHeight: 360 }}>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <span className="badge badge-pill" style={{ marginBottom: 12, display: 'inline-flex' }}>{current.name}</span>
              <h3 style={{ margin: '8px 0 0', fontSize: '1.4rem' }}>{current.name}</h3>
              <p className="text-muted" style={{ marginTop: 8 }}>{current.description}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: 12 }}>Applications</h4>
              <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-secondary)' }}>
                {current.applications.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: 12 }}>Sample Projects</h4>
              <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-secondary)' }}>
                {current.projects.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <button type="button" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Select This Domain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
