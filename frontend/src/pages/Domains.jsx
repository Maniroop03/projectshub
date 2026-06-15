import { useMemo, useState } from 'react';
import { DOMAINS } from '../data/domains';

export default function Domains() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const current = useMemo(
    () => DOMAINS.find((d) => d.id === selected),
    [selected]
  );
  
  const filteredDomains = DOMAINS.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container domain-explorer">
      <div className="domain-toolbar">
        <div className="domain-toolbar-content">
          <div className="domains-header">
  <h1>📚 Explore Domains</h1>
  <p>
    Browse all available project domains below. Click a domain to learn more,
    then select it for your project.
            </p>
          </div>
          <div className="domain-search-row">
          <div className="domain-search">
            <span className="domain-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="domain-count">
            {filteredDomains.length} domains
          </span>
        </div>
        </div>
      </div>

      <div className="domain-grid-layout">
        <div className="domain-grid">
          {filteredDomains.map((domain) => {
            const isActive = selected === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                className={`domain-card ${domain.colorClass} ${isActive ? 'active' : ''}`}
                onClick={() => setSelected(domain.id)}
              >
                <div className="domain-card-icon-wrapper">
                  {domain.icon}
                </div>
                <div className="domain-card-text-wrapper">
                  <h2>{domain.name}</h2>
                  <p>{domain.shortDescription}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* This class setup transforms the layout block to shift colors globally */}
        <div className={`domain-panel ${current?.colorClass || ''}`}>

  {!current ? (

    <div className="domain-placeholder">
      <div className="domain-placeholder-icon">👆</div>

      <h3>
        Click on any domain card to explore its
        details, applications, and sample projects.
      </h3>

      <p>
        Then press <strong>Select This Domain</strong>
        to choose it.
      </p>
    </div>

  ) : (

    <div className="domain-panel-body">

      <div className="domain-panel-header">
        <div className="domain-panel-icon-box">
          {current.icon}
        </div>

        <div className="domain-panel-title-area">
          <h3>{current.name}</h3>
          <p>{current.shortDescription}</p>
        </div>
      </div>

      <p className="domain-full-description">
        {current.fullDescription}
      </p>

      <div className="domain-panel-section">
        <h4>🔧 Applications</h4>
        <div className="domain-apps-container">
          {current.applications.map((app) => (
            <div className="domain-app-item" key={app}>
              {app}
            </div>
          ))}
        </div>
      </div>

      <div className="domain-panel-section">
        <h4>💡 Sample Projects</h4>
        <div className="domain-projects-container">
          {current.projects.map((project) => (
            <div className="domain-project-item" key={project}>
              <span className="project-bullet">💡</span>
              <span className="project-text">{project}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="domain-panel-footer">
      <button className="btn-primary select-domain-btn">
        Select This Domain ➔
      </button>
      </div>
    </div>

  )}

</div>
      </div>
    </div>
  );
}
