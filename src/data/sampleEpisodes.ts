import { PodcastEpisode, SourceDocument } from '../types';

export const INITIAL_SOURCES: SourceDocument[] = [
  {
    id: 'src-1',
    title: 'Quantum Advantage & Topological Qubits Overview.pdf',
    type: 'file',
    content: `Recent breakthroughs in fault-tolerant quantum computing have demonstrated significant error suppression through topological qubits and surface-code error correction. Quantum processors can now handle over 10,000 logical operations before decoherence. Major applications include molecular simulation for battery chemistry, cryptographic key generation, and ultra-fast financial portfolio optimization. Unlike classical supercomputers that process binary bits sequentially, quantum superposition allows simultaneous evaluation of multi-dimensional state spaces.`,
    wordCount: 82,
    addedAt: '2026-08-01',
    tags: ['Physics', 'Quantum', 'Hardware'],
    selected: true,
  },
  {
    id: 'src-2',
    title: 'Agentic Workflows & Multi-Agent Swarms Report',
    type: 'notes',
    content: `AI System Architectures in 2026: Shift from single prompt-completion models to autonomous agentic loops. Systems now leverage multi-step reasoning, tool execution, self-correction, and long-term memory retrieval. Key architectures include hierarchical coordinator-worker patterns, reflection agents, and tool-augmented reasoners. Performance evaluations show a 4.2x increase in complex task completion reliability compared to standalone LLMs. Ethics and safety mechanisms incorporate real-time policy guardrails and human-in-the-loop oversight.`,
    wordCount: 78,
    addedAt: '2026-08-03',
    tags: ['AI', 'Agentic Systems', 'Software'],
    selected: true,
  },
  {
    id: 'src-3',
    title: 'https://techreview.example.com/mars-colony-power-grids',
    type: 'url',
    content: `Designing micro-nuclear reactors and high-efficiency solar arrays for the first permanent Martian settlement. Energy storage challenges during 6-month dust storms require hybrid flow battery systems and deep geothermal wells. Space exploration agencies and private aerospace consortia are preparing the infrastructure for initial habitat power delivery in the early 2030s.`,
    wordCount: 56,
    addedAt: '2026-08-05',
    url: 'https://techreview.example.com/mars-colony-power-grids',
    tags: ['Space', 'Energy', 'Engineering'],
    selected: false,
  },
];

export const SAMPLE_EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-quantum-breakthrough',
    title: 'The Quantum Leap: Topological Qubits Explained',
    tagline: 'Deep Dive Audio Overview into Fault-Tolerant Quantum Computing',
    topicSummary: 'A comprehensive breakdown of recent breakthroughs in quantum computing, surface codes, and real-world implications for battery chemistry & cryptography.',
    format: 'deep_dive',
    tone: 'engaging',
    length: 'short',
    coverImage: '/src/assets/images/quantum_breakthrough_cover_1786044820425.jpg',
    createdAt: '2026-08-05',
    durationSeconds: 154,
    sourcesUsed: ['src-1'],
    audioSynthesized: false,
    speakers: [
      { id: 'spk-1', name: 'Alex', role: 'Host A', voiceName: 'Kore', gender: 'female', color: '#3b82f6' },
      { id: 'spk-2', name: 'Sarah', role: 'Host B', voiceName: 'Puck', gender: 'male', color: '#10b981' },
    ],
    showNotes: {
      summary: 'In this NotebookLM-style audio overview, Alex and Sarah explore the paradigm shift in quantum computing enabled by topological qubits and fault-tolerant error correction. They demystify complex physics concepts and discuss practical commercial timelines.',
      keyTakeaways: [
        'Surface-code error suppression allows over 10,000 logical quantum operations before decoherence.',
        'Immediate industrial impacts include material science for next-gen solid-state batteries.',
        'Classical supercomputers face fundamental limits where quantum superposition offers exponential speedups.'
      ],
      discussionQuestions: [
        'How soon will commercial industries transition from classical HPC to hybrid quantum algorithms?',
        'What post-quantum encryption standards should enterprise software deploy today?'
      ],
      references: [
        'Quantum Advantage & Topological Qubits Overview (2026 Paper)',
        'Global Quantum Computing Institute Technical Digest'
      ]
    },
    chapters: [
      { timestamp: 0, title: 'Introduction: The Quantum Promise', summary: 'Setting the stage for why quantum computing is making headlines again.' },
      { timestamp: 35, title: 'Decoding Topological Qubits', summary: 'Explaining error correction and logical qubits vs physical noise.' },
      { timestamp: 80, title: 'Real-World Applications', summary: 'From battery chemistry to financial modeling and cryptography.' },
      { timestamp: 125, title: 'Conclusion & Key Takeaways', summary: 'Summary of the roadmap for the next decade in quantum tech.' },
    ],
    slides: [
      {
        id: 'slide-1',
        index: 0,
        timestamp: 0,
        title: 'The Quantum Paradigm Shift',
        subtitle: 'From Bits to Superposition',
        bullets: [
          'Classical Bits: 0 or 1 binary state',
          'Quantum Qubits: Simultaneous superposition of states',
          'Entanglement enables exponential parallel computation'
        ],
        keyQuote: '"We are witnessing the transition from theoretical physics to practical engineering."',
        visualConcept: 'Quantum Chip Architecture',
        chartType: 'comparison',
      },
      {
        id: 'slide-2',
        index: 1,
        timestamp: 35,
        title: 'Surface-Code Error Suppression',
        subtitle: 'Conquering Quantum Decoherence',
        bullets: [
          'Physical Noise: Environmental thermal fluctuations disrupt state',
          'Topological Protection: Braiding non-Abelian anyons for stability',
          'Milestone: >10,000 logical operations per session'
        ],
        keyQuote: '"Error rates dropped by three orders of magnitude through topological protection."',
        chartType: 'bar',
      },
      {
        id: 'slide-3',
        index: 2,
        timestamp: 80,
        title: 'Commercial Impact Spheres',
        subtitle: 'Where Quantum Wins First',
        bullets: [
          'Solid-State Battery Simulation (Lithium & Solid Electrolyte)',
          'Post-Quantum Cryptographic Key Exchange',
          'Ultra-Fast Financial Portfolio Optimization'
        ],
        keyQuote: '"Simulating a single complex battery molecule classical supercomputers take 1000 years — quantum does in seconds."',
        chartType: 'pie',
      },
      {
        id: 'slide-4',
        index: 3,
        timestamp: 125,
        title: 'Roadmap to Quantum Maturity',
        subtitle: '2026-2030 Horizons',
        bullets: [
          'Hybrid Quantum-Classical Cloud Processing',
          'Standardization of Quantum Algorithmic SDKs',
          'Widespread Enterprise Adoption'
        ],
        keyQuote: '"The future is non-binary."',
        chartType: 'timeline',
      }
    ],
    lines: [
      {
        id: 'l-1',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Welcome back to NotebookCast! Today, Sarah and I are digging into a fascinating new paper on fault-tolerant quantum computing.',
        timestamp: 0,
        duration: 7,
        emotion: 'excited',
        soundEffect: 'subtle intro chime',
        slideIndex: 0
      },
      {
        id: 'l-2',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Yeah, Alex, this report is huge. For years, the big blocker has been noise — decoherence breaking down qubits before they can finish calculations.',
        timestamp: 7,
        duration: 8,
        emotion: 'thoughtful',
        slideIndex: 0
      },
      {
        id: 'l-3',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Exactly! But this breakthrough centers on topological qubits. By braiding non-Abelian anyons, they effectively protect the quantum information from environmental interference.',
        timestamp: 15,
        duration: 9,
        emotion: 'curious',
        slideIndex: 0
      },
      {
        id: 'l-4',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Right! The paper demonstrates over 10,000 fault-tolerant logical operations without crashing. That is a game changer for real-world applications.',
        timestamp: 24,
        duration: 11,
        emotion: 'surprised',
        soundEffect: 'paper shuffle',
        slideIndex: 0
      },
      {
        id: 'l-5',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'So let us look at the slides. How does this compare to classical supercomputers when we talk about practical problems like chemistry?',
        timestamp: 35,
        duration: 8,
        emotion: 'neutral',
        slideIndex: 1
      },
      {
        id: 'l-6',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Consider battery design. Simulating electron interactions in solid-state electrolytes requires calculating infinite quantum state interactions. Classical supercomputers take centuries.',
        timestamp: 43,
        duration: 11,
        emotion: 'thoughtful',
        slideIndex: 1
      },
      {
        id: 'l-7',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'While a topological quantum system handles those exact quantum interactions natively in seconds! It is literally nature simulating nature.',
        timestamp: 54,
        duration: 8,
        emotion: 'excited',
        slideIndex: 1
      },
      {
        id: 'l-8',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Precisely. And beyond materials science, financial firms are eyeing this for multi-variable risk modeling and portfolio optimization.',
        timestamp: 62,
        duration: 8,
        emotion: 'serious',
        slideIndex: 1
      },
      {
        id: 'l-9',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'What about security? Everyone asks about quantum breaking RSA encryption.',
        timestamp: 70,
        duration: 10,
        emotion: 'curious',
        slideIndex: 1
      },
      {
        id: 'l-10',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'That is why NIST and security consortia are rolling out post-quantum cryptography standards right now. As quantum scales up, lattice-based cryptography will keep data secure.',
        timestamp: 80,
        duration: 11,
        emotion: 'serious',
        slideIndex: 2
      },
      {
        id: 'l-11',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'So the takeaway here is that we are moving out of the laboratory era into the engineering deployment phase.',
        timestamp: 91,
        duration: 7,
        emotion: 'thoughtful',
        slideIndex: 2
      },
      {
        id: 'l-12',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: '100%. Expect hybrid cloud systems where classical CPUs route heavy linear algebra to quantum coprocessors.',
        timestamp: 98,
        duration: 8,
        emotion: 'amused',
        slideIndex: 2
      },
      {
        id: 'l-13',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Fantastic analysis! Check out our NotebookCast show notes and video slides to dive deeper into the diagrams.',
        timestamp: 106,
        duration: 7,
        emotion: 'excited',
        soundEffect: 'outro fade music',
        slideIndex: 3
      },
      {
        id: 'l-14',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Thanks for listening, everyone! Hit subscribe and create your own audio overviews right here in NotebookCast Studio.',
        timestamp: 113,
        duration: 8,
        emotion: 'excited',
        slideIndex: 3
      }
    ]
  },
  {
    id: 'ep-ai-agent-revolution',
    title: 'Agentic Intelligence: The Next Frontier of Autonomous AI',
    tagline: 'NotebookLM-Style Breakdown of Multi-Agent Swarms & Reasoning Loops',
    topicSummary: 'An in-depth look at how AI architectures evolved from simple chat completions to self-correcting multi-agent networks that execute complex workflows.',
    format: 'deep_dive',
    tone: 'engaging',
    length: 'short',
    coverImage: '/src/assets/images/ai_agent_revolution_cover_1786044831743.jpg',
    createdAt: '2026-08-06',
    durationSeconds: 140,
    sourcesUsed: ['src-2'],
    audioSynthesized: false,
    speakers: [
      { id: 'spk-1', name: 'Alex', role: 'Host A', voiceName: 'Zephyr', gender: 'male', color: '#8b5cf6' },
      { id: 'spk-2', name: 'Sarah', role: 'Host B', voiceName: 'Kore', gender: 'female', color: '#ec4899' },
    ],
    showNotes: {
      summary: 'Alex and Sarah analyze the shift toward agentic AI swarms, tool usage, and reflection loops. They highlight why 2026 is the year AI shifted from static chat assistants to goal-driven autonomous coworkers.',
      keyTakeaways: [
        'Multi-agent workflows demonstrate a 4.2x higher success rate on complex coding and analytical tasks.',
        'Reflection loops enable models to critique and fix their own errors before returning final results.',
        'Human-in-the-loop guardrails remain essential for enterprise safety.'
      ],
      discussionQuestions: [
        'Which business processes are best suited for autonomous multi-agent delegation?',
        'How do we ensure transparency and auditability in multi-agent tool execution?'
      ],
      references: [
        'Agentic Workflows & Multi-Agent Swarms Technical Report (2026)',
        'Autonomous Systems Ethics Framework'
      ]
    },
    chapters: [
      { timestamp: 0, title: 'From Chatbots to Autonomous Agents', summary: 'Why simple prompt-completion is no longer enough.' },
      { timestamp: 35, title: 'Architectures: Coordinator-Worker Swarms', summary: 'How multiple AI specialized agents collaborate.' },
      { timestamp: 80, title: 'Self-Correction & Tool Execution', summary: 'The secret sauce: Reflection and error recovery.' },
      { timestamp: 120, title: 'Conclusion & Future Vision', summary: 'What this means for the workforce and software development.' },
    ],
    slides: [
      {
        id: 's-ai-1',
        index: 0,
        timestamp: 0,
        title: 'Evolution of AI Systems',
        subtitle: 'Chat Completions vs Agentic Workflows',
        bullets: [
          'Phase 1: Direct Prompt-Response Chat',
          'Phase 2: Single-Tool Calling (Search, Calculator)',
          'Phase 3: Autonomous Agent Swarms & Planning Loops'
        ],
        keyQuote: '"AI is moving from answering questions to accomplishing multi-step goals."',
        chartType: 'timeline',
      },
      {
        id: 's-ai-2',
        index: 1,
        timestamp: 35,
        title: 'Swarm Architecture',
        subtitle: 'Coordinator & Specialist Agents',
        bullets: [
          'Orchestrator Agent: Decomposes tasks & assigns sub-goals',
          'Specialist Agents: Code, Research, Verification, Design',
          'Shared Memory & Context Bus'
        ],
        keyQuote: '"A team of specialized micro-agents outperforms a single gigantic generalist model by 4.2x."',
        chartType: 'comparison',
      },
      {
        id: 's-ai-3',
        index: 2,
        timestamp: 80,
        title: 'The Reflection & Self-Correction Loop',
        subtitle: 'Eliminating Hallucinations',
        bullets: [
          'Generate Initial Plan -> Execute Tools -> Inspect Output',
          'If Error: Self-Critique & Retry with Updated Context',
          'Guardrails: Policy enforcement & safety filters'
        ],
        keyQuote: '"Self-correction turns random errors into guaranteed task completion."',
        chartType: 'bar',
      }
    ],
    lines: [
      {
        id: 'al-1',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Hey everyone, welcome back! Today Sarah and I are breaking down the biggest trend in AI right now: Agentic Swarms.',
        timestamp: 0,
        duration: 7,
        emotion: 'excited',
        slideIndex: 0
      },
      {
        id: 'al-2',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'That is right, Alex. We have moved way past simple single-turn chatbot answers. Now it is all about systems that plan, use tools, and fix their own mistakes.',
        timestamp: 7,
        duration: 9,
        emotion: 'thoughtful',
        slideIndex: 0
      },
      {
        id: 'al-3',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Look at the data in source report number two. A team of specialized micro-agents shows a 4.2 times higher success rate on complex technical tasks compared to a single prompt!',
        timestamp: 16,
        duration: 11,
        emotion: 'surprised',
        slideIndex: 0
      },
      {
        id: 'al-4',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'Why? Because when you break a huge problem into sub-tasks — like research, drafting, testing, and auditing — each agent operates within a sharp focused context.',
        timestamp: 27,
        duration: 10,
        emotion: 'neutral',
        slideIndex: 1
      },
      {
        id: 'al-5',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'And the secret ingredient is the reflection loop. If an agent tries a code script or API call and it fails, it does not just crash.',
        timestamp: 37,
        duration: 8,
        emotion: 'curious',
        slideIndex: 1
      },
      {
        id: 'al-6',
        speakerId: 'spk-2',
        speakerName: 'Sarah',
        text: 'It inspects the error log, adjusts its approach, and retries automatically until it gets a valid outcome. That is true autonomy.',
        timestamp: 45,
        duration: 8,
        emotion: 'excited',
        slideIndex: 2
      },
      {
        id: 'al-7',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'This is super exciting! Be sure to check out the NotebookCast video studio to see the full architecture diagram slides in action.',
        timestamp: 53,
        duration: 8,
        emotion: 'excited',
        slideIndex: 2
      }
    ]
  }
];
