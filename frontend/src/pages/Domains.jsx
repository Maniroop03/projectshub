import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAINS } from '../data/domains';

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

              <ul className="domain-list">
                {current.applications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="domain-panel-section">
              <h4>💡 Sample Projects</h4>

              <ul className="domain-list">
                {current.projects.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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