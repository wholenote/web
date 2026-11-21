export const experience = [
  {
    id: "amazon",
    company: "Amazon",
    role: "Senior Security Engineer",
    dates: "2021 – present",
    focus: "Detection engineering, AI security & automation",
    highlights: [
      "Built threat detections across 3,000+ facilities and 200+ telemetry sources, spanning endpoint, network, and industrial control systems.",
      "Architected an agentic AI platform with LangGraph and a custom MCP server, cutting detection development time by 50% and documentation effort by 80%.",
      "Designed AI guardrails that validate generated Splunk queries before execution, and advised teams building agentic incident response and threat hunting systems.",
      "Built automated detection validation across 693 logistics facilities; reduced validation runtime by 80% and false positives by 85%+.",
    ],
    cardHighlights: [
      "Engineered threat detections across 3,000+ facilities and 200+ telemetry sources.",
      "Built an agentic AI platform that cut detection development time by 50%.",
      "Automated validation across 693 facilities, reducing false positives by 85%+.",
    ],
    tools: ["Python", "LangGraph", "MCP", "Splunk", "AWS"],
  },
  {
    id: "firstenergy",
    company: "FirstEnergy",
    role: "Security Analyst",
    dates: "2020",
    focus: "Security operations & threat intelligence",
    highlights: [
      "Developed Python and JavaScript SOAR playbooks to automate security investigation and response workflows.",
      "Implemented MITRE ATT&CK-aligned threat intelligence workflows for automated indicator sharing and sightings reporting.",
      "Built a threat intelligence aggregation tool using the Twitter API to collect indicators of compromise.",
    ],
    cardHighlights: [
      "Automated investigation and response with Python and JavaScript SOAR playbooks.",
      "Built MITRE ATT&CK-aligned workflows for indicator sharing and sightings.",
      "Collected threat indicators with an automated Twitter API aggregation tool.",
    ],
    tools: ["Python", "JavaScript", "SOAR", "MITRE ATT&CK"],
  },
  {
    id: "copart",
    company: "Copart",
    role: "Security Engineer",
    dates: "2019",
    focus: "Vulnerability management & security engineering",
    highlights: [
      "Doubled vulnerability scan processing efficiency with Python automation for vulnerability management workflows.",
      "Built a GitHub source code exposure detection tool using natural language processing and similarity analysis.",
      "Assessed business applications and browser extensions across an enterprise environment of 10,000 endpoints.",
    ],
    cardHighlights: [
      "Doubled vulnerability scan processing efficiency with Python automation.",
      "Built a GitHub code exposure detector using NLP and similarity analysis.",
      "Assessed applications and browser extensions across 10,000 endpoints.",
    ],
    tools: ["Python", "NLP", "GitHub", "Vulnerability management"],
  },
];

export const education = [
  { school: "Georgia Institute of Technology", degree: "Master of Science in Cybersecurity", year: "2025" },
  { school: "Texas A&M University", degree: "Bachelor of Science in Computer Science", year: "2022" },
];
