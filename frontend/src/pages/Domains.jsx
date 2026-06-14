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

<div className="domain-grid-layout">
        <div className="domain-grid">
          {filteredDomains.map((domain) => (
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
      {current?.icon}
    </div>

    <div>
      <h3>{current?.name}</h3>
      <p>{current?.shortDescription}</p>
    </div>
  </div>

  <p className="domain-full-description">
    {current?.fullDescription}
  </p>

  <div className="domain-panel-section">
    <h4>🔧 Applications</h4>

    {(current?.applications || []).map(app => (
      <div className="domain-app-item" key={app}>
        {app}
      </div>
    ))}
  </div>

  <div className="domain-panel-section">
    <h4>💡 Sample Projects</h4>

    {(current?.projects || []).map(project => (
      <div className="domain-project-item" key={project}>
        {project}
      </div>
    ))}
  </div>

  <button className="btn-primary">
    Select This Domain →
  </button>

</div>
        </div>
      </div>
    </div>
  );
}
