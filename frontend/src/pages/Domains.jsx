import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DOMAINS = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    icon: '🤖',
    shortDescription: 'Building intelligent systems that reason and act',
    fullDescription:
      'Artificial Intelligence focuses on creating systems capable of simulating human intelligence, including reasoning, learning, decision making, problem solving, and automation.',

    applications: [
      'Chatbots & Virtual Assistants',
      'Recommendation Systems',
      'Predictive Analytics',
      'Expert Systems',
      'Intelligent Automation'
    ],

    projects: [
      'AI Career Guidance System',
      'Smart Attendance System',
      'Virtual Assistant',
      'Student Performance Predictor',
      'AI Help Desk'
    ]
  },

  {
    id: 'ml',
    name: 'Machine Learning',
    icon: '⚙️',
    shortDescription:
      'Systems that learn from data and improve from experience',

    fullDescription:
      'Machine Learning enables computers to learn patterns from data and make predictions or decisions without being explicitly programmed.',

    applications: [
      'Fraud Detection',
      'Classification Models',
      'Prediction Systems',
      'Data Mining',
      'Recommendation Engines'
    ],

    projects: [
      'Disease Prediction System',
      'Spam Email Detection',
      'Student Performance Prediction',
      'Loan Approval Prediction',
      'Stock Price Forecasting'
    ]
  },

  {
    id: 'web',
    name: 'Web Development',
    icon: '🌐',
    shortDescription:
      'Crafting modern web experiences end-to-end',

    fullDescription:
      'Web Development focuses on designing and building responsive, interactive, and scalable web applications for businesses, organizations, and users.',

    applications: [
      'E-Commerce Platforms',
      'Management Systems',
      'Business Websites',
      'Customer Portals',
      'Enterprise Applications'
    ],

    projects: [
      'Student Project Management System',
      'Online Shopping Portal',
      'Hospital Management System',
      'Library Management System',
      'Event Management Platform'
    ]
  }
];

const DomainCard = memo(function DomainCard({
  domain,
  active,
  onSelect
}) {
  return (
    <button
      type="button"
      className={`domain-card ${active ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className="domain-card-icon">
        {domain.icon}
      </div>

      <div>
        <h2>{domain.name}</h2>
        <p>{domain.shortDescription}</p>
      </div>
    </button>
  );
});

export default function Domains() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState('ai');

  const current = useMemo(
    () => DOMAINS.find((d) => d.id === selected),
    [selected]
  );

  return (
    <div className="page-container domain-explorer">
      <div className="page-header">
        <h1 className="page-title">
          Explore Domains
        </h1>

        <p className="page-subtitle">
          Browse all available project domains below.
          Click a domain to learn more, then select it
          for your project.
        </p>
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

        <div className="domain-panel">
          <div className="domain-panel-body">
            <div className="domain-panel-header">
              <div className="domain-panel-icon">
                {current.icon}
              </div>

              <div>
                <h3>{current.name}</h3>

                <p>
                  {current.shortDescription}
                </p>
              </div>
            </div>

            <p className="domain-full-description">
              {current.fullDescription}
            </p>

            <div className="domain-panel-section">
              <h4>🔧 Applications</h4>

              {current.applications.map((item) => (
                <div
                  key={item}
                  className="application-item"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="domain-panel-section">
              <h4>💡 Sample Projects</h4>

              {current.projects.map((item) => (
                <div
                  key={item}
                  className="project-item"
                >
                  {item}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  `/projects/new?domain=${encodeURIComponent(
                    current.name
                  )}`
                )
              }
            >
              Select This Domain →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
