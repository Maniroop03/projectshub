import { memo, useMemo, useState } from 'react';
import { DOMAINS } from '../data/domains';

const CATEGORIES = [
  { id: 'all', label: 'All Domains' },
  { id: 'ai-ml', label: 'AI & Machine Learning' },
  { id: 'security', label: 'Security & Forensics' },
  { id: 'dev', label: 'Web & Development' },
  { id: 'specialized', label: 'Specialized Fields' }
];

const DomainCard = memo(function DomainCard({ domain, active, onSelect }) {
  return (
    <button
      type="button"
      className={`domain-card ${domain.colorClass || ''} ${active ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className="domain-card-icon-wrapper">{domain.icon}</div>
      <div className="domain-card-text-wrapper">
        <h2>{domain.name}</h2>
        <p>{domain.shortDescription}</p>
      </div>
    </button>
  );
});

export default function Domains() {
  const [selected, setSelected] = useState('ai');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('apps'); // Switcher state: 'apps' or 'projects'

  // Semantic grouping map logic
  const categoryMap = useMemo(() => ({
    'ai-ml': ['ai', 'nlp', 'dl', 'ml', 'cv', 'prompt', 'llm', 'ethics', 'datascience'],
    'security': ['crypto', 'cyber', 'forensics', 'malware', 'ids'],
    'dev': ['web', 'mobile', 'devops', 'blockchain', 'game', 'uiux', 'darkpatterns'],
    'specialized': ['ip', 'dm', 'cloud', 'hci', 'iot', 'edge', 'quantum', 'arvr', 'rpa', 'assistive', 'fintech', 'egov', 'bioinfo', 'compbio', 'social', 'scientific', 'green']
  }), []);

  // Filter pipeline combining categories & text search matching
  const filteredDomains = useMemo(() => {
    return DOMAINS.filter((domain) => {
      const matchesSearch = domain.name.toLowerCase().includes(search.toLowerCase());
      if (activeCategory === 'all') return matchesSearch;
      const validIds = categoryMap[activeCategory] || [];
      return validIds.includes(domain.id) && matchesSearch;
    });
  }, [search, activeCategory, categoryMap]);

  const current = useMemo(
    () => DOMAINS.find((d) => d.id === selected) || filteredDomains[0] || DOMAINS[0],
    [selected, filteredDomains]
  );

  return (
    <div className="page-container domain-explorer">
      {/* Search Toolbar */}
      <div className="domain-toolbar">
        <div className="domain-toolbar-content">
          <div className="domain-search">
            <span className="domain-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search across domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="domain-count">
            {filteredDomains.length} domains visible
          </span>
        </div>
      </div>

      {/* Idea 1: Smooth Pill Filter Categories */}
      <div className="category-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat.id);
              // Auto reset selection to first matching domain to prevent ghost panel look
              const matching = DOMAINS.find(d => cat.id === 'all' || (categoryMap[cat.id] || []).includes(d.id));
              if (matching) setSelected(matching.id);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="domain-grid-layout">
        {/* Left Side Grid Track */}
        <div className="domain-grid">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              active={selected === domain.id}
              onSelect={() => setSelected(domain.id)}
            />
          ))}
          {filteredDomains.length === 0 && (
            <div className="domain-empty-state">
              <span>⚠️</span> No domains found matching your current filter criteria.
            </div>
          )}
        </div>

        {/* Right Side Adaptive Detail Panel */}
        <div className={`domain-panel ${current?.colorClass || ''}`}>
          <div className="domain-panel-body">
            
            {/* Header Identity Core */}
            <div className="domain-panel-header">
              <div className="domain-panel-icon-box">
                {current?.icon}
              </div>
              <div className="domain-panel-title-area">
                <h3>{current?.name}</h3>
                <p>{current?.shortDescription}</p>
              </div>
            </div>

            <p className="domain-full-description">
              {current?.fullDescription}
            </p>

            {/* Idea 3/4: Dynamic Tab Controls Switcher */}
            <div className="panel-tab-headers">
              <button
                type="button"
                className={`tab-toggle-btn ${activeTab === 'apps' ? 'active' : ''}`}
                onClick={() => setActiveTab('apps')}
              >
                🔧 Applications
              </button>
              <button
                type="button"
                className={`tab-toggle-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                💡 Sample Projects
              </button>
            </div>

            {/* Dynamic Content Views */}
            <div className="panel-tab-body-container">
              {activeTab === 'apps' ? (
                <div className="domain-panel-section fade-in-engine">
                  <div className="domain-apps-container">
                    {(current?.applications || []).map((app) => (
                      <div className="domain-app-item" key={app}>
                        {app}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="domain-panel-section fade-in-engine">
                  <div className="domain-projects-container">
                    {(current?.projects || []).map((project) => (
                      <div className="domain-project-item" key={project}>
                        <span className="project-bullet">✨</span>
                        <span className="project-text">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Premium CTA Activation Anchor */}
            <button className="btn-primary select-domain-btn">
              Select This Domain ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
