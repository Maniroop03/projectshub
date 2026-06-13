import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLanguage,
  MdMemory,
  MdSettings,
  MdSmartToy,
  MdWeb,
  MdVisibility,
  MdImage,
  MdAnalytics,
  MdSecurity,
  MdCloud,
  MdGesture,
  MdShield,
  MdSearch,
} from 'react-icons/md';

const DOMAINS = [
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    icon: <MdLanguage size={26} />,
    description: 'Teaching machines to understand and derive meaning from human language.',
    applications: ['Chatbots & Virtual Assistants', 'Machine Translation', 'Sentiment Analysis', 'Named Entity Recognition'],
    projects: ['Sentiment analysis on social media', 'Automatic text summarizer', 'Question answering system'],
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    icon: <MdMemory size={26} />,
    description: 'Neural networks that mimic the human brain for advanced pattern recognition.',
    applications: ['Image classification', 'Speech recognition', 'Anomaly detection'],
    projects: ['Image recognition system', 'Voice-based assistant', 'Predictive maintenance model'],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: <MdSettings size={26} />,
    description: 'Systems that learn from data and improve from experience.',
    applications: ['Recommendation engines', 'Fraud detection', 'Predictive analytics'],
    projects: ['Student performance predictor', 'Course recommendation system', 'Sales forecasting dashboard'],
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    icon: <MdSmartToy size={26} />,
    description: 'Building intelligent systems that reason and act.',
    applications: ['Automation', 'Intelligent assistants', 'Decision support'],
    projects: ['AI-based tutoring system', 'Smart chatbot platform', 'Adaptive assessment tool'],
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: <MdWeb size={26} />,
    description: 'Crafting modern web experiences end-to-end.',
    applications: ['Responsive websites', 'Progressive web apps', 'API-driven dashboards'],
    projects: ['Portfolio website', 'E-commerce platform', 'Project management app'],
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    icon: <MdVisibility size={26} />,
    description: 'Enabling machines to see and interpret visuals.',
    applications: ['Object detection', 'Video analysis', 'Face recognition'],
    projects: ['License plate reader', 'Gesture recognition tool', 'Visual search engine'],
  },
  {
    id: 'image-processing',
    name: 'Image Processing',
    icon: <MdImage size={26} />,
    description: 'Transforming and enhancing digital images.',
    applications: ['Image enhancement', 'Feature extraction', 'Medical imaging'],
    projects: ['Photo filter editor', 'Image compression tool', 'Document scanner'],
  },
  {
    id: 'data-mining',
    name: 'Data Mining',
    icon: <MdAnalytics size={26} />,
    description: 'Discovering hidden patterns in large datasets.',
    applications: ['Customer segmentation', 'Trend detection', 'Market analysis'],
    projects: ['Data clustering explorer', 'Sales trend dashboard', 'Recommendation engine'],
  },
  {
    id: 'network-security',
    name: 'Cryptography and Network Security',
    icon: <MdSecurity size={26} />,
    description: 'Protecting data and communication in the digital age.',
    applications: ['Encryption', 'Secure messaging', 'Threat detection'],
    projects: ['Secure file transfer', 'Password manager', 'Network intrusion monitor'],
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: <MdCloud size={26} />,
    description: 'Scalable infrastructure and services on demand.',
    applications: ['Cloud storage', 'Serverless apps', 'Distributed systems'],
    projects: ['Cloud backup tool', 'Serverless API', 'Resource usage dashboard'],
  },
  {
    id: 'human-computer-interaction',
    name: 'Human-Computer Interaction',
    icon: <MdGesture size={26} />,
    description: 'Designing intuitive and accessible user experiences.',
    applications: ['UX research', 'Interaction design', 'Accessibility tools'],
    projects: ['Interactive prototyping app', 'Voice UI demo', 'Accessibility validator'],
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    icon: <MdShield size={26} />,
    description: 'Defending systems and data from digital attacks.',
    applications: ['Threat hunting', 'Vulnerability scanning', 'Risk assessment'],
    projects: ['Phishing detection app', 'Secure login portal', 'Incident response dashboard'],
  },
];

export default function Domains() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(DOMAINS[0].id);

  const filteredDomains = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return DOMAINS;
    return DOMAINS.filter((domain) => domain.name.toLowerCase().includes(query));
  }, [search]);

  useEffect(() => {
    if (!filteredDomains.some((domain) => domain.id === selected)) {
      setSelected(filteredDomains[0]?.id || DOMAINS[0].id);
    }
  }, [filteredDomains, selected]);

  const current = DOMAINS.find((d) => d.id === selected) || DOMAINS[0];

  return (
    <div className="page-container domain-explorer">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title">Explore Domains</h1>
        <p className="page-subtitle">Browse all available project domains below. Click a domain to learn more, then select it for your project.</p>
      </div>

      <div className="domain-toolbar card mb-6">
        <div className="domain-toolbar-content">
          <div className="domain-search">
            <MdSearch className="domain-search-icon" />
            <input
              type="search"
              placeholder="Search domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="domain-count">{DOMAINS.length} domains</div>
        </div>
      </div>

      <div className="domain-grid-layout">
        <div className="domain-grid">
          {filteredDomains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              className={`domain-card ${selected === domain.id ? 'active' : ''}`}
              onClick={() => setSelected(domain.id)}
            >
              <div className="domain-card-icon">{domain.icon}</div>
              <div>
                <h2>{domain.name}</h2>
                <p>{domain.description}</p>
              </div>
            </button>
          ))}
          {filteredDomains.length === 0 && (
            <div className="domain-empty-message card">
              No domains matched your search.
            </div>
          )}
        </div>

        <div className="domain-panel card">
          <div className="domain-panel-body">
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
          </div>
        </div>
      </div>
    </div>
  );
}
