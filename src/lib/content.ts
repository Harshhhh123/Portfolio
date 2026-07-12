// Theme-agnostic content. Both AWS and GCP skins render from this single source
// so the two "consoles" always stay in sync.

export const person = {
  name: "Harsh Goilkar",
  tagline: "Cloud/DevOps Engineer & Full-Stack Developer",
  location: "Mumbai, India",
  bio: [
    "B.Tech in Information Technology at Dwarkadas J. Sanghvi College of Engineering, graduating 2027, CGPA 9.1+.",
    "Cloud and DevOps-focused engineer who is equally comfortable shipping full-stack product features end to end.",
    "Currently building production infrastructure and consumer-facing features at a fintech startup, alongside a growing portfolio of self-directed cloud-native and AI systems.",
  ],
  email: "harshgoilkar27@gmail.com",
  linkedin: "https://linkedin.com/in/PLACEHOLDER",
  github: "https://github.com/PLACEHOLDER",
  resumeHref: "#",
};

export const education = {
  institution: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
  degree: "B.Tech in Information Technology",
  graduation: "2027",
  gpa: "9.1+ CGPA",
  location: "Mumbai, India",
};

export type ExperienceProduct = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  status: "LIVE" | "LAUNCH IMMINENT" | "IN PRODUCTION";
  flagship?: boolean;
  link?: string | null;
};

export const experience = {
  company: "GoChanakya",
  role: "Full Stack Development Intern",
  period: "Aug 2025 -- Apr 2026",
  companyBlurb:
    "GoChanakya is a fintech company building a suite of products spanning wealth management, portfolio analytics for advisors, financial education, and market data.",
  products: [
    {
      id: "gowealthy",
      name: "GoWealthy",
      summary: "DIY consumer financial planning app.",
      detail:
        "Built the core financial dashboard aggregating insurance policies, goals, emergency funds, and allocation metrics -- shipped as a production feature used by active users.",
      status: "LIVE",
      link: "PLACEHOLDER: GoWealthy live product URL",
    },
    {
      id: "goportfolios",
      name: "GoPortfolios",
      summary: "B2B SaaS portfolio analytics platform for wealth managers and advisors.",
      detail:
        "The flagship product of the internship: a production-grade, launch-imminent B2B SaaS platform giving wealth managers and advisors deep portfolio analytics. Headline credential of this role.",
      status: "LAUNCH IMMINENT",
      flagship: true,
      link: "PLACEHOLDER: GoPortfolios live product URL",
    },
    {
      id: "kyc-pipeline",
      name: "KYC Verification Pipeline",
      summary: "Aadhaar and PAN document ingestion with automated identity processing.",
      detail:
        "Complete KYC verification pipeline handling Aadhaar and PAN document ingestion, secure cloud storage, and automated identity processing, built on GCP Cloud Run to cut manual verification overhead.",
      status: "IN PRODUCTION",
      link: null,
    },
    {
      id: "mf-platform",
      name: "Mutual Fund Investment Platform",
      summary: "KYC journey, bank mandate setup, and SIP onboarding.",
      detail:
        "Implemented the KYC journey, bank mandate setup, and SIP onboarding flows, and analyzed NSE Mutual Fund APIs for order placement and settlement lifecycle integration.",
      status: "IN PRODUCTION",
      link: null,
    },
  ] as ExperienceProduct[],
};

export type Project = {
  id: string;
  name: string;
  category: "cloud" | "ai";
  tagline: string;
  description: string;
  stack: string[];
  github?: string;
  video?: string;
  liveLink?: string;
  flagship?: boolean;
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    id: "kubevigil",
    name: "kubevigil",
    category: "cloud",
    tagline: "AI-Powered GitOps Drift Detection Platform",
    description:
      "An AI-powered Kubernetes drift detection platform that continuously reconciles live cluster state against Git manifests, detecting configuration drift within 60 seconds across Deployments, ConfigMaps, Secrets, and RBAC resources. Includes a LangChain agent with custom tools performing automated root cause analysis across kubectl audit logs and AWS CloudTrail, reconstructing the exact cause of drift and auto-generating remediation PRs with blast-radius impact analysis. Deployed on AWS EKS using Terraform IaC and ArgoCD GitOps, with a Kafka event pipeline (5 topics) streaming state snapshots, drift events, and audit data across microservices. Currently being packaged as a Helm chart for single-command installation on any Kubernetes cluster, with a real-time MERN dashboard (Socket.IO) showing a live drift map and AI-generated incident reports.",
    stack: ["Node.js", "AWS EKS", "Kafka", "LangChain", "Terraform", "React", "ArgoCD", "Socket.IO"],
    github: "PLACEHOLDER: KubeVigil GitHub URL",
    video: "PLACEHOLDER: KubeVigil demo video URL",
    flagship: true,
    metrics: [
      { label: "Drift detection latency", value: "< 60s" },
      { label: "Kafka topics", value: "5" },
      { label: "Resource kinds watched", value: "Deployments, ConfigMaps, Secrets, RBAC" },
    ],
  },
  {
    id: "eventify",
    name: "eventify",
    category: "cloud",
    tagline: "Cloud-Native Event Booking Platform",
    description:
      "Dockerized microservices deployed on AWS ECS Fargate behind an Application Load Balancer, with rolling deployments and automated health checks. JWT-based auth and RBAC across all services. Race-condition-safe seat reservation system using DynamoDB conditional writes to prevent double-booking under concurrent load. Fully async notification workflows via SQS, Lambda, and SES. CI/CD pipeline via GitHub Actions using AWS OIDC for zero-credential deployments to ECR and ECS.",
    stack: ["Node.js", "AWS ECS", "DynamoDB", "SQS", "Docker", "GitHub Actions"],
    github: "PLACEHOLDER: Eventify GitHub URL",
    video: "PLACEHOLDER: Eventify demo video URL",
    metrics: [
      { label: "Double-booking rate", value: "0%" },
      { label: "Deploys", value: "Zero-credential (OIDC)" },
    ],
  },
  {
    id: "sentinel",
    name: "sentinel",
    category: "cloud",
    tagline: "Cloud-Hosted Monitoring & Anomaly Detection Platform",
    description:
      "Dockerized monitoring services ingesting AWS CloudWatch metrics through a Kafka-based event streaming pipeline. Custom processors for aggregation, anomaly detection, and predictive alerting across ECS services. Time-series operational data stored and queried in PostgreSQL, visualized via Grafana. Deployed via ECR and ECS Fargate with GitHub Actions CI/CD. Tracks CPU, memory, and request/error rates, detects anomalies, and generates predictive saturation signals.",
    stack: ["Docker", "AWS CloudWatch", "Kafka", "PostgreSQL", "Grafana", "ECS/ECR"],
    github: "PLACEHOLDER: Sentinel GitHub URL",
    video: "PLACEHOLDER: Sentinel demo video URL",
    metrics: [
      { label: "Signals tracked", value: "CPU, memory, error rate" },
      { label: "Alerting", value: "Predictive saturation" },
    ],
  },
  {
    id: "voxagent",
    name: "voxagent",
    category: "ai",
    tagline: "Multilingual RAG-Based Voice AI Assistant",
    description:
      "A multilingual conversational voice and text assistant using Retrieval-Augmented Generation over custom knowledge base documents for context-aware responses, with a memory-enabled multi-turn dialogue system. Integrated Sarvam AI for multilingual Speech-to-Text and Text-to-Speech, enabling interaction in regional Indian languages and English. Backend built with FastAPI, LlamaIndex, and ChromaDB for retrieval; uses Groq (LLaMA 3) for low-latency inference.",
    stack: ["Python", "FastAPI", "LangChain", "LlamaIndex", "Sarvam AI", "Groq", "ChromaDB"],
    liveLink: "PLACEHOLDER: VoxAgent link (repo or live demo)",
  },
  {
    id: "ppe-safety",
    name: "ppe-safety-compliance",
    category: "ai",
    tagline: "Real-Time PPE Detection & Compliance System",
    description:
      "A real-time PPE detection pipeline using YOLOv8 to monitor multi-camera RTSP streams and identify missing helmets and safety vests, achieving ~3ms inference latency at 25FPS. Person-PPE association implemented via bounding box IoU overlap logic. FastAPI backend with WebRTC streaming broadcasts compliance alerts across multiple concurrent CCTV feeds. Event-driven architecture using Redis as a real-time data bus for compliance status, coordinates, and violation tracking. FFmpeg + MediaMTX RTSP server enables scalable multi-stream video processing for enterprise workplace safety monitoring.",
    stack: ["Python", "YOLOv8", "FastAPI", "WebRTC", "Redis", "FFmpeg"],
    liveLink: "PLACEHOLDER: PPE Safety Compliance link (repo or live demo)",
  },
];

export type SkillGroup = {
  category: string;
  note: string;
  skills: { name: string; level: number }[];
};

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    note: "Baseline fluency across the stack.",
    skills: [
      { name: "JavaScript (ES6+)", level: 92 },
      { name: "Python", level: 85 },
      { name: "Java", level: 78 },
    ],
  },
  {
    category: "Backend",
    note: "Where most production hours go.",
    skills: [
      { name: "REST APIs", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 88 },
      { name: "JWT Authentication", level: 87 },
      { name: "WebSockets", level: 80 },
    ],
  },
  {
    category: "Cloud -- AWS",
    note: "Primary cloud. Heaviest usage quota on the account.",
    skills: [
      { name: "S3", level: 92 },
      { name: "IAM", level: 91 },
      { name: "ECS", level: 90 },
      { name: "EKS", level: 88 },
      { name: "CloudWatch", level: 88 },
      { name: "ECR", level: 85 },
      { name: "DynamoDB", level: 86 },
      { name: "SQS", level: 82 },
      { name: "Lambda", level: 80 },
      { name: "CloudTrail", level: 79 },
      { name: "RDS", level: 78 },
      { name: "VPC", level: 76 },
      { name: "API Gateway", level: 75 },
      { name: "SES", level: 74 },
    ],
  },
  {
    category: "Cloud -- GCP",
    note: "Production usage from the GoChanakya KYC pipeline.",
    skills: [{ name: "Cloud Run", level: 83 }],
  },
  {
    category: "DevOps & Infra",
    note: "The stuff that keeps the other stuff running.",
    skills: [
      { name: "Docker", level: 93 },
      { name: "Docker Compose", level: 89 },
      { name: "GitHub Actions", level: 88 },
      { name: "Kubernetes", level: 85 },
      { name: "Terraform", level: 81 },
      { name: "AWS OIDC", level: 80 },
      { name: "ArgoCD", level: 77 },
      { name: "Helm", level: 70 },
    ],
  },
  {
    category: "AI / Gen AI",
    note: "RAG pipelines and agentic tooling.",
    skills: [
      { name: "RAG Pipelines", level: 84 },
      { name: "LangChain", level: 82 },
      { name: "LlamaIndex", level: 76 },
      { name: "HuggingFace Transformers", level: 65 },
    ],
  },
  {
    category: "Databases",
    note: "Relational, key-value, document -- whatever the workload needs.",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "DynamoDB", level: 86 },
      { name: "Redis", level: 80 },
      { name: "RDS", level: 78 },
      { name: "Firebase Firestore", level: 72 },
    ],
  },
  {
    category: "System Design",
    note: "How the pieces are supposed to fit together.",
    skills: [
      { name: "Microservices", level: 87 },
      { name: "Event-Driven Architecture", level: 84 },
      { name: "Async Processing", level: 85 },
      { name: "GitOps", level: 82 },
      { name: "IaC", level: 83 },
      { name: "Idempotency", level: 78 },
      { name: "DLQ", level: 76 },
    ],
  },
  {
    category: "Tools",
    note: "Daily drivers.",
    skills: [
      { name: "Git", level: 95 },
      { name: "Postman", level: 90 },
      { name: "Apache Kafka", level: 81 },
      { name: "Grafana", level: 79 },
      { name: "Prometheus", level: 74 },
    ],
  },
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  kind: "hackathon" | "leadership";
  severity: "INFO" | "WARNING" | "OK";
};

export const achievements: Achievement[] = [
  {
    id: "hackniche",
    title: "HackNiche 4.0",
    description: "Top 5 finish, national-level hackathon.",
    kind: "hackathon",
    severity: "OK",
  },
  {
    id: "alphabyte",
    title: "AlphaByte 2.0 (PCCOE)",
    description: "Top 10 finish, national-level hackathon.",
    kind: "hackathon",
    severity: "OK",
  },
  {
    id: "pixel-paranoia",
    title: "Pixel Paranoia",
    description: "Finalist, UI/UX Hackathon.",
    kind: "hackathon",
    severity: "INFO",
  },
  {
    id: "csi-productions",
    title: "Productions Head -- DJS Computer Society of India",
    description: "Led production and logistics for CSI's flagship technical events.",
    kind: "leadership",
    severity: "INFO",
  },
  {
    id: "anveshan-creatives",
    title: "Creatives Head -- DJS Anveshan (R&D Club)",
    description: "Led creative direction for the college's research and development club.",
    kind: "leadership",
    severity: "INFO",
  },
];

export const contact = {
  email: person.email,
  linkedin: person.linkedin,
  github: person.github,
};
