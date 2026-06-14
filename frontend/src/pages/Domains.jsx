import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAINS } from '../data/domains';
import './domains.css';

// Group structures mapped out precisely to match filter rules
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
      <div className="domain-card-icon-wrapper">
        {domain.icon}
      </div>
      <div className="domain-card-text-wrapper">
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('apps'); // Sub-tab state: 'apps' | 'projects'

  // Map individual domain keys to active category groupings
  const categoryMap = useMemo(() => ({
    'ai-ml': ['ai', 'nlp', 'dl', 'ml', 'cv', 'prompt', 'llm', 'ethics', 'datascience'],
    'security': ['crypto', 'cyber', 'forensics', 'malware', 'ids'],
    'dev': ['web', 'mobile', 'devops', 'blockchain', 'game', 'uiux', 'darkpatterns'],
    'specialized': ['ip', 'dm', 'cloud', 'hci', 'iot', 'edge', 'quantum', 'arvr', 'rpa', 'assistive', 'fintech', 'egov', 'bioinfo', 'compbio', 'social', 'scientific', 'green']
  }), []);

  // Filter pipeline execution
  const filteredDomains = useMemo(() => {
    return DOMAINS.filter((domain) => {
      const matchesSearch = domain.name.toLowerCase().includes(search.toLowerCase());
      if (activeCategory === 'all') return matchesSearch;
      const explicitIds = categoryMap[activeCategory] || [];
      return explicitIds.includes(domain.id) && matchesSearch;
    });
  }, [search, activeCategory, categoryMap]);

  // Keep a selected item context visible even through filtering alterations
  const current = useMemo(() => {
    const found = DOMAINS.find((d) => d.id === selected);
    if (found && filteredDomains.some(d => d.id === selected)) return found;
    return filteredDomains[0] || null;
  }, [selected, filteredDomains]);

  return (
    <div className="page-container domain-explorer">
      
      {/* Search Header Container */}
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

      {/* Pill Filter Navigation Row */}
      <div className="category-filter-bar">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category.id);
              const matches = DOMAINS.find(d => category.id === 'all' || (categoryMap[category.id] || []).includes(d.id));
              if (matches) setSelected(matches.id);
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Main Split Grid Layout Framework */}
      <div className="domain-grid-layout">
        
        {/* Card Picker Area */}
        <div className="domain-grid">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              active={current?.id === domain.id}
              onSelect={() => setSelected(domain.id)}
            />
          ))}
          
          {filteredDomains.length === 0 && (
            <div className="domain-empty-state">
              <span>⚠️</span> No active domains match your current filter parameters.
            </div>
          )}
        </div>

        {/* Dynamic Detail Panel Area */}
        {current && (
          <div className={`domain-panel ${current.colorClass || ''}`}>
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

              {/* Sidebar Segment Tabs Switcher */}
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

              {/* Tab Display Area */}
              <div className="panel-tab-body-container">
                {activeTab === 'apps' ? (
                  <div className="domain-panel-section fade-in-engine">
                    <div className="domain-apps-container">
                      {(current.applications || []).map((app) => (
                        <div className="domain-app-item" key={app}>
                          <span className="app-dot"></span>
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="domain-panel-section fade-in-engine">
                    <div className="domain-projects-container">
                      {(current.projects || []).map((project) => (
                        <div className="domain-project-item" key={project}>
                          <span className="project-bullet">✨</span>
                          <span className="project-text">{project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                className="btn btn-primary select-domain-btn"
                onClick={() => navigate(`/projects/new?domain=${current.id}`)}
              >
                Select This Domain ➔
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
