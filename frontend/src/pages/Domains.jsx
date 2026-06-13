import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

const DOMAINS = [
  {
    id: 'rpa',
    name: 'Robotic Process Automation (RPA)',
    icon: '🤖',
    color: '#8B5CF6',
    description: 'Automating repetitive digital tasks using software bots.',
    applications: ['Workflow automation', 'Data entry bots', 'Process monitoring'],
    projects: ['Invoice processing bot', 'Automated report generation', 'Task scheduling assistant'],
  },
  {
    id: 'assistive-tech',
    name: 'Assistive Technologies',
    icon: '♿',
    color: '#6366F1',
    description: 'Creating technology to improve accessibility and independence.',
    applications: ['Speech assistance', 'Adaptive interfaces', 'Accessibility tools'],
    projects: ['Voice navigation app', 'Screen reader enhancements', 'Gesture-controlled UI'],
  },
  {
    id: 'fintech',
    name: 'FinTech & Banking Systems',
    icon: '💳',
    color: '#14B8A6',
    description: 'Innovating financial services with secure, modern technology.',
    applications: ['Digital banking', 'Payment processing', 'Risk management'],
    projects: ['Mobile wallet', 'Budgeting dashboard', 'Loan approval engine'],
  },
  {
    id: 'e-governance',
    name: 'E-Governance Systems',
    icon: '🏛️',
    color: '#F59E0B',
    description: 'Enhancing public services and democratic processes through digital platforms.',
    applications: ['Citizen portals', 'Service automation', 'Policy tracking'],
    projects: ['Public service dashboard', 'Document verification system', 'Community feedback hub'],
  },
  {
    id: 'bioinformatics',
    name: 'Bioinformatics',
    icon: '🧬',
    color: '#22C55E',
    description: 'Analyzing complex biological data using computational tools.',
    applications: ['Genomic analysis', 'Protein modeling', 'Medical research'],
    projects: ['DNA sequence analyzer', 'Protein structure predictor', 'Clinical data explorer'],
  },
  {
    id: 'computational-biology',
    name: 'Computational Biology',
    icon: '⚛️',
    color: '#F97316',
    description: 'Developing models of biological systems to study life processes.',
    applications: ['Systems biology', 'Simulation models', 'Bioinformatics analysis'],
    projects: ['Cell behavior simulator', 'Ecological modeler', 'Pathway visualization tool'],
  },
  {
    id: 'social-network-analysis',
    name: 'Social Network Analysis',
    icon: '🕸️',
    color: '#A855F7',
    description: 'Investigating social structures through network and graph theories.',
    applications: ['Community detection', 'Influence mapping', 'Relationship analytics'],
    projects: ['Social graph explorer', 'Trend propagation analyzer', 'Network cluster tool'],
  },
  {
    id: 'scientific-computing',
    name: 'Scientific Computing',
    icon: '📐',
    color: '#0EA5E9',
    description: 'Solving mathematical models of scientific problems computationally.',
    applications: ['Numerical simulation', 'Model optimization', 'Data visualization'],
    projects: ['Physics solver', 'Climate model builder', 'High-performance analysis app'],
  },
  {
    id: 'prompt-engineering',
    name: 'Generative AI Prompt Engineering',
    icon: '✨',
    color: '#EC4899',
    description: 'Structuring optimal inputs to get desired outputs from generative models.',
    applications: ['Content generation', 'Chatbot prompts', 'Creative AI workflows'],
    projects: ['Prompt library manager', 'AI response tuner', 'Creative prompt tool'],
  },
  {
    id: 'llms',
    name: 'Large Language Models (LLMs)',
    icon: '💬',
    color: '#8B5CF6',
    description: 'Building and fine-tuning massive language models for text tasks.',
    applications: ['Text generation', 'Summarization', 'Conversational AI'],
    projects: ['Chatbot builder', 'Content summarizer', 'Language model evaluator'],
  },
  {
    id: 'ai-ethics',
    name: 'AI Ethics & Responsible AI',
    icon: '⚖️',
    color: '#6366F1',
    description: 'Ensuring AI systems are fair, transparent, accountable, and unbiased.',
    applications: ['Bias detection', 'Transparency tools', 'Ethical auditing'],
    projects: ['Fairness evaluator', 'Compliance dashboard', 'AI ethics checklist'],
  },
  {
    id: 'green-computing',
    name: 'Green Computing',
    icon: '🌱',
    color: '#22C55E',
    description: 'Designing energy-efficient hardware and software systems.',
    applications: ['Power optimization', 'Resource efficiency', 'Sustainable design'],
    projects: ['Energy tracking dashboard', 'Low-power scheduler', 'Green infrastructure planner'],
  },
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
                <div className="domain-placeholder-icon">👉</div>
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
