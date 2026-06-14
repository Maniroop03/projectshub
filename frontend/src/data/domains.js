export const DOMAINS = [
  {
    id: 'ai',
    colorClass: 'ai',
    name: 'Artificial Intelligence',
    icon: '🤖',
    shortDescription: 'Building intelligent systems that reason and act',
    fullDescription: 'Artificial Intelligence focuses on creating systems capable of simulating human intelligence, reasoning, learning, and decision making.',
    applications: ['Chatbots', 'Recommendation Systems', 'Automation', 'Expert Systems', 'Predictive Analytics'],
    projects: ['AI Career Guidance', 'Smart Attendance', 'Virtual Assistant']
  },
  {
    id: 'nlp',
    colorClass: 'nlp',
    name: 'Natural Language Processing',
    icon: '📝',
    shortDescription: 'Enabling machines to understand human language',
    fullDescription: 'NLP enables computers to process, analyze, and generate human language.',
    applications: ['Chatbots', 'Translation', 'Sentiment Analysis', 'Text Summarization', 'Speech Recognition'],
    projects: ['Resume Parser', 'AI Chatbot', 'Sentiment Analyzer']
  },
  {
    id: 'dl',
    colorClass: 'dl',
    name: 'Deep Learning',
    icon: '🧠',
    shortDescription: 'Advanced neural networks for intelligent systems',
    fullDescription: 'Deep Learning uses multi-layer neural networks to solve complex problems involving vision, speech, and language.',
    applications: ['Image Recognition', 'Speech Processing', 'Autonomous Systems'],
    projects: ['Face Recognition', 'Voice Assistant', 'Traffic Sign Detection']
  },
  {
    id: 'ml',
    colorClass: 'ml',
    name: 'Machine Learning',
    icon: '⚙️',
    shortDescription: 'Systems that learn and improve from experience',
    fullDescription: 'Machine Learning algorithms build computational models based on sample training data to make predictions or decisions without explicit human programming.',
    applications: ['Predictive Modeling', 'Supervised Learning', 'Unsupervised Learning', 'Anomaly Detection'],
    projects: ['House Price Prediction', 'Customer Churn Tracker', 'Stock Trend Predictor']
  },
  {
    id: 'web',
    colorClass: 'web',
    name: 'Web Development',
    icon: '🌐',
    shortDescription: 'Crafting modern responsive web applications',
    fullDescription: 'Web Development spans building interactive frontend spaces, robust backend microservices frameworks, database layers, and responsive API routing pipelines.',
    applications: ['E-commerce Engines', 'SaaS Architectures', 'RESTful API Services', 'Content Management'],
    projects: ['College Management Portal', 'E-Store with Payment Gateways', 'Real-time Chat App']
  },
  {
    id: 'compbio',
    colorClass: 'compbio',
    name: 'Computational Biology',
    icon: '🧬',
    shortDescription: 'Data analytics for complex biological structures',
    fullDescription: 'Computational Biology builds mathematical modeling structures and algorithmic simulations to decrypt complex data structures found across genomic and biological domains.',
    applications: ['Genome Sequencing Analysis', 'Structural Proteomics', 'Epidemiologic Modeling', 'Phylogenetics'],
    projects: ['DNA Sequence Alignment Tool', 'Protein Folding Simulator', 'Genomic Variant Predictor']
  },
  {
    id: 'cv',
    colorClass: 'cv',
    name: 'Computer Vision',
    icon: '👁️',
    shortDescription: 'Teaching computers to see and interpret images',
    fullDescription: 'Computer Vision focuses on extracting information from images and videos.',
    applications: ['Object Detection', 'Face Recognition', 'Surveillance Systems'],
    projects: ['Attendance Using Face Recognition', 'Vehicle Detection', 'Smart Surveillance']
  },
  {
    id: 'ip',
    colorClass: 'ip',
    name: 'Image Processing',
    icon: '🖼️',
    shortDescription: 'Enhancing and analyzing digital images',
    fullDescription: 'Image Processing deals with manipulation and enhancement of images for analysis.',
    applications: ['Medical Imaging', 'Image Enhancement', 'Pattern Recognition'],
    projects: ['MRI Analysis', 'Image Enhancement Tool', 'Fingerprint Recognition']
  },
  {
    id: 'dm',
    colorClass: 'dm',
    name: 'Data Mining',
    icon: '⛏️',
    shortDescription: 'Discovering patterns hidden in data',
    fullDescription: 'Data Mining extracts useful information and patterns from large datasets.',
    applications: ['Business Intelligence', 'Customer Segmentation', 'Risk Analysis'],
    projects: ['Market Basket Analysis', 'Customer Prediction', 'Fraud Detection']
  },
  {
    id: 'crypto',
    colorClass: 'crypto',
    name: 'Cryptography & Network Security',
    icon: '🔐',
    shortDescription: 'Protecting data and communications',
    fullDescription: 'Focuses on encryption, authentication, and secure communication systems.',
    applications: ['Encryption', 'Secure Communication', 'Digital Signatures'],
    projects: ['Secure File Sharing', 'Encrypted Chat App', 'Authentication System']
  },
  {
    id: 'cloud',
    colorClass: 'cloud',
    name: 'Cloud Computing',
    icon: '☁️',
    shortDescription: 'Scalable computing over the internet',
    fullDescription: 'Cloud Computing delivers computing services over the internet.',
    applications: ['Cloud Storage', 'Serverless Apps', 'Distributed Systems'],
    projects: ['Cloud Backup System', 'SaaS Platform', 'Cloud LMS']
  },
  {
    id: 'hci',
    colorClass: 'hci',
    name: 'Human-Computer Interaction',
    icon: '🖥️',
    shortDescription: 'Improving interaction between users and systems',
    fullDescription: 'HCI studies how humans interact with computer systems and interfaces.',
    applications: ['Accessibility', 'Usability Testing', 'Interactive Systems'],
    projects: ['Smart Interface Design', 'Accessibility Tool', 'Interactive Dashboard']
  },
  {
    id: 'cyber',
    colorClass: 'cyber',
    name: 'Cyber Security',
    icon: '🛡️',
    shortDescription: 'Defending systems against cyber threats',
    fullDescription: 'Cyber Security protects systems, networks, and data from attacks.',
    applications: ['Threat Detection', 'Security Monitoring', 'Vulnerability Assessment'],
    projects: ['Security Scanner', 'Threat Dashboard', 'Penetration Testing Tool']
  },
  {
    id: 'analytics',
    colorClass: 'analytics',
    name: 'Data Analytics',
    icon: '📊',
    shortDescription: 'Turning data into actionable insights',
    fullDescription: 'Data Analytics involves collecting, processing, and interpreting data.',
    applications: ['Business Intelligence', 'Visualization', 'Forecasting'],
    projects: ['Sales Dashboard', 'Student Analytics', 'Healthcare Insights']
  },
  {
    id: 'iot',
    colorClass: 'iot',
    name: 'Internet of Things',
    icon: '📡',
    shortDescription: 'Connecting smart devices and sensors',
    fullDescription: 'IoT enables communication between connected devices and systems.',
    applications: ['Smart Homes', 'Industrial Automation', 'Smart Cities'],
    projects: ['Smart Irrigation', 'Home Automation', 'Air Quality Monitor']
  },
  {
    id: 'game',
    colorClass: 'game',
    name: 'Game Development',
    icon: '🎮',
    shortDescription: 'Designing interactive gaming experiences',
    fullDescription: 'Game Development involves creating engaging digital games.',
    applications: ['2D Games', '3D Games', 'Simulation Games'],
    projects: ['Adventure Game', 'Puzzle Game', 'Multiplayer Game']
  },
  {
    id: 'darkpatterns',
    colorClass: 'darkpatterns',
    name: 'Dark Patterns',
    icon: '🎭',
    shortDescription: 'Studying deceptive UX practices',
    fullDescription: 'Focuses on identifying and preventing manipulative user interface practices.',
    applications: ['UX Audits', 'Consumer Protection', 'Ethical Design'],
    projects: ['Dark Pattern Detector', 'UX Compliance Tool', 'Design Analyzer']
  },
  {
    id: 'uiux',
    colorClass: 'uiux',
    name: 'UI/UX Design',
    icon: '🎨',
    shortDescription: 'Creating intuitive user experiences',
    fullDescription: 'UI/UX focuses on usability, accessibility, and visual design.',
    applications: ['Product Design', 'Mobile Interfaces', 'Web Interfaces'],
    projects: ['Portfolio Redesign', 'App Prototype', 'UX Audit Tool']
  },
  {
    id: 'datascience',
    colorClass: 'datascience',
    name: 'Data Science',
    icon: '📈',
    shortDescription: 'Combining statistics, AI, and computing',
    fullDescription: 'Data Science extracts meaningful insights using data-driven methods.',
    applications: ['Prediction', 'Research', 'Analytics'],
    projects: ['Disease Prediction', 'Market Forecasting', 'Recommendation Engine']
  },
  {
    id: 'forensics',
    colorClass: 'forensics',
    name: 'Digital Forensics',
    icon: '🔍',
    shortDescription: 'Investigating digital evidence',
    fullDescription: 'Digital Forensics identifies and analyzes evidence from digital devices.',
    applications: ['Crime Investigation', 'Incident Response', 'Evidence Recovery'],
    projects: ['Log Analyzer', 'Forensic Toolkit', 'File Recovery System']
  },
  {
    id: 'malware',
    colorClass: 'malware',
    name: 'Malware Analysis',
    icon: '☣️',
    shortDescription: 'Analyzing malicious software behavior',
    fullDescription: 'Malware Analysis studies viruses, ransomware, and cyber threats.',
    applications: ['Threat Intelligence', 'Reverse Engineering', 'Incident Analysis'],
    projects: ['Malware Sandbox', 'Threat Detector', 'Behavior Analyzer']
  },
  {
    id: 'ids',
    colorClass: 'ids',
    name: 'Intrusion Detection Systems',
    icon: '🚨',
    shortDescription: 'Detecting unauthorized system access',
    fullDescription: 'IDS monitors systems and networks for malicious activity.',
    applications: ['Network Monitoring', 'Threat Detection', 'Security Alerts'],
    projects: ['Network IDS', 'SIEM Dashboard', 'Threat Monitor']
  },
  {
    id: 'mobile',
    colorClass: 'mobile',
    name: 'Mobile Application Development',
    icon: '📱',
    shortDescription: 'Building applications for mobile devices',
    fullDescription: 'Mobile Development focuses on Android and iOS applications.',
    applications: ['Business Apps', 'Social Apps', 'Utility Apps'],
    projects: ['Campus App', 'Expense Tracker', 'Fitness App']
  },
  {
    id: 'devops',
    colorClass: 'devops',
    name: 'DevOps',
    icon: '⚙️',
    shortDescription: 'Bridging development and operations',
    fullDescription: 'DevOps automates software delivery and infrastructure management.',
    applications: ['CI/CD', 'Automation', 'Infrastructure as Code'],
    projects: ['CI/CD Pipeline', 'Deployment Dashboard', 'Monitoring Tool']
  },
  {
    id: 'edge',
    colorClass: 'edge',
    name: 'Edge Computing',
    icon: '🌐',
    shortDescription: 'Processing data closer to devices',
    fullDescription: 'Edge Computing reduces latency by processing data near its source.',
    applications: ['IoT', 'Real-Time Systems', 'Smart Devices'],
    projects: ['Smart Edge Monitor', 'Edge Analytics', 'IoT Gateway']
  },
  {
    id: 'blockchain',
    colorClass: 'blockchain',
    name: 'Blockchain Technology',
    icon: '⛓️',
    shortDescription: 'Building decentralized trust systems',
    fullDescription: 'Blockchain provides secure and decentralized transaction systems.',
    applications: ['Cryptocurrency', 'Supply Chain', 'Digital Identity'],
    projects: ['Voting System', 'Supply Chain Tracker', 'NFT Marketplace']
  },
  {
    id: 'quantum',
    colorClass: 'quantum',
    name: 'Quantum Computing',
    icon: '⚛️',
    shortDescription: 'Computing beyond classical limitations',
    fullDescription: 'Quantum Computing leverages quantum mechanics for computation.',
    applications: ['Optimization', 'Cryptography', 'Simulation'],
    projects: ['Quantum Simulator', 'Quantum Cryptography Demo', 'Optimization Tool']
  },
  {
    id: 'arvr',
    colorClass: 'arvr',
    name: 'AR/VR',
    icon: '🥽',
    shortDescription: 'Immersive augmented and virtual experiences',
    fullDescription: 'AR/VR combines virtual content with real-world interaction.',
    applications: ['Education', 'Gaming', 'Training'],
    projects: ['Virtual Campus', 'AR Learning App', 'VR Training System']
  },
  {
    id: 'rpa',
    colorClass: 'rpa',
    name: 'Robotic Process Automation',
    icon: '🤖',
    shortDescription: 'Automating repetitive business tasks',
    fullDescription: 'RPA automates rule-based processes using software robots.',
    applications: ['Business Automation', 'Workflow Automation', 'Data Entry'],
    projects: ['Invoice Automation', 'HR Bot', 'Email Processing Bot']
  },
  {
    id: 'assistive',
    colorClass: 'assistive',
    name: 'Assistive Technologies',
    icon: '♿',
    shortDescription: 'Technology for accessibility and inclusion',
    fullDescription: 'Assistive Technologies improve accessibility for people with disabilities.',
    applications: ['Accessibility', 'Healthcare', 'Education'],
    projects: ['Voice Navigation App', 'Smart Wheelchair', 'Reading Assistant']
  },
  {
    id: 'fintech',
    colorClass: 'fintech',
    name: 'FinTech & Banking Systems',
    icon: '💳',
    shortDescription: 'Innovating financial services with technology',
    fullDescription: 'FinTech combines finance and technology to improve banking services.',
    applications: ['Digital Payments', 'Fraud Detection', 'Online Banking'],
    projects: ['UPI Payment System', 'Loan Management', 'Expense Analyzer']
  },
  {
    id: 'egov',
    colorClass: 'egov',
    name: 'E-Government Systems',
    icon: '🏛️',
    shortDescription: 'Digitizing public services',
    fullDescription: 'E-Government systems improve efficiency and accessibility of government services.',
    applications: ['Citizen Services', 'Digital Governance', 'Public Records'],
    projects: ['Online Grievance Portal', 'Smart Municipality', 'E-Service Portal']
  },
  {
    id: 'bioinfo',
    colorClass: 'bioinfo',
    name: 'Bioinformatics',
    icon: '🧬',
    shortDescription: 'Applying computing to biological data',
    fullDescription: 'Bioinformatics analyzes biological information using computational tools.',
    applications: ['Genomics', 'Drug Discovery', 'Healthcare Research'],
    projects: ['Gene Analyzer', 'DNA Sequence Tool', 'Protein Predictor']
  },
  {
    id: 'social',
    colorClass: 'social',
    name: 'Social Network Analysis',
    icon: '👥',
    shortDescription: 'Studying relationships in social networks',
    fullDescription: 'Analyzes social structures through network theory and graph analytics.',
    applications: ['Community Detection', 'Influence Analysis', 'Recommendation Systems'],
    projects: ['Influencer Detector', 'Network Visualizer', 'Community Finder']
  },
  {
    id: 'scientific',
    colorClass: 'scientific',
    name: 'Scientific Computing',
    icon: '🔬',
    shortDescription: 'Solving scientific problems computationally',
    fullDescription: 'Scientific Computing applies numerical methods to scientific research.',
    applications: ['Simulation', 'Modeling', 'Research Computing'],
    projects: ['Weather Simulator', 'Physics Engine', 'Research Platform']
  },
  {
    id: 'prompt',
    colorClass: 'prompt',
    name: 'Generative AI Prompt Engineering',
    icon: '✨',
    shortDescription: 'Designing effective AI prompts',
    fullDescription: 'Prompt Engineering optimizes interactions with generative AI systems.',
    applications: ['Content Generation', 'Automation', 'AI Workflows'],
    projects: ['Prompt Optimizer', 'AI Assistant', 'Content Generator']
  },
  {
    id: 'llm',
    colorClass: 'llm',
    name: 'Large Language Models (LLMs)',
    icon: '📚',
    shortDescription: 'Building applications with foundation models',
    fullDescription: 'LLMs power advanced conversational and generative AI systems.',
    applications: ['Chatbots', 'Knowledge Systems', 'Automation'],
    projects: ['Campus GPT', 'Document QA System', 'AI Tutor']
  },
  {
    id: 'ethics',
    colorClass: 'ethics',
    name: 'AI Ethics & Responsible AI',
    icon: '⚖️',
    shortDescription: 'Ensuring fairness and accountability in AI',
    fullDescription: 'Responsible AI promotes fairness, transparency, and ethical use of AI systems.',
    applications: ['Bias Detection', 'Governance', 'Compliance'],
    projects: ['Bias Analyzer', 'AI Audit Tool', 'Ethics Dashboard']
  },
  {
    id: 'green',
    colorClass: 'green',
    name: 'Green Computing',
    icon: '🌱',
    shortDescription: 'Sustainable and energy-efficient computing',
    fullDescription: 'Green Computing reduces environmental impact through efficient technology usage.',
    applications: ['Energy Optimization', 'Sustainable Systems', 'Carbon Tracking'],
    projects: ['Power Usage Monitor', 'Green Data Center Dashboard', 'Energy Optimizer']
  }
];
