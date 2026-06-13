import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

const DOMAINS = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    icon: '🤖',
    color: '#8B5CF6',
    description: 'Building intelligent systems that can reason, learn, and make decisions.',
    applications: [
      'Chatbots',
      'Virtual Assistants',
      'Expert Systems'
    ],
    projects: [
      'AI Career Guidance System',
      'Smart Attendance System',
      'Virtual Assistant'
    ],
  },

  {
    id: 'ml',
    name: 'Machine Learning',
    icon: '⚙️',
    color: '#6366F1',
    description: 'Systems that learn from data and improve their performance automatically.',
    applications: [
      'Prediction Systems',
      'Fraud Detection',
      'Classification Models'
    ],
    projects: [
      'Student Performance Prediction',
      'Disease Prediction System',
      'Spam Email Detection'
    ],
  },

  {
    id: 'web',
    name: 'Web Development',
    icon: '🌐',
    color: '#14B8A6',
    description: 'Designing and developing responsive modern web applications.',
    applications: [
      'E-Commerce Platforms',
      'Management Systems',
      'Business Websites'
    ],
    projects: [
      'Student Project Management System',
      'Online Shopping Portal',
      'Library Management System'
    ],
  }
];
const DomainCard = memo(function DomainCard({ domain, active, onSelect }) {
  return (
    <button
      type="button"
      className={`domain-card ${active ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className="domain-card-icon" style={{ color: '#ffffff' }}>
        {domain.icon}
      </div>
      <div>
        <h2>{domain.name}</h2>
        <p>{domain.description}</p>
      </div>
    </button>
  );
});

export default function Domains() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const current = useMemo(() => DOMAINS.find((d) => d.id === selected) || null, [selected]);

  return (
    <div className="page-container domain-explorer">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title">Explore Domains</h1>
        <p className="page-subtitle">Browse all available project domains below. Click a domain to learn more, then select it for your project.</p>
      </div>

      <div className="domain-grid-layout">
        <div className="domain-grid">
          {DOMAINS.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              active={selected === domain.id}
              onSelect={() => setSelected(domain.id)}
            />
          ))}
        </div>

        <div className="domain-panel card">
          <div className="domain-panel-body">
            {current ? (
              <>
                <div className="domain-panel-header">
                  <div className="domain-panel-icon">{current.icon}</div>
                  <div>
                    <h3>{current.name}</h3>
                    <p>{current.description}</p>
                  </div>
                </div>

                <div className="domain-panel-section">
                  <h4>Applications</h4>
                  <ul>
                    {current.applications.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>

                <div className="domain-panel-section">
                  <h4>Sample Projects</h4>
                  <ul>
                    {current.projects.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate(`/projects/new?domain=${encodeURIComponent(current.name)}`)}
                >
                  Select This Domain
                </button>
              </>
            ) : (
              <div className="domain-placeholder">
                <div className="domain-placeholder-icon">👆</div>
                <h3>Click on any domain card to explore its details, applications, and sample projects.</h3>
                <p>Then press <strong style={{ color: 'var(--accent-purple)' }}>Select This Domain</strong> to choose it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
