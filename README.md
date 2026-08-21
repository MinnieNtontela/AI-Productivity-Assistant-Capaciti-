
# AI Workplace Productivity Assistant

A modern, responsive web application designed to help enterprise professionals automate repetitive daily workflows using structured AI prompts and task-oriented tooling.

---

### Project Overview

The **AI Workplace Productivity Assistant** provides an all-in-one suite of AI-driven utilities tailored for corporate communications, meeting operations, project planning, market synthesis, and ad-hoc task assistance.

```
ai-workplace-assistant/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── DisclaimerBanner.tsx
│   │   └── tools/
│   │       ├── EmailGenerator.tsx
│   │       ├── MeetingSummarizer.tsx
│   │       ├── TaskPlanner.tsx
│   │       ├── ResearchAssistant.tsx
│   │       └── CopilotChat.tsx
│   ├── prompts/
│   │   ├── emailPrompts.ts
│   │   ├── meetingPrompts.ts
│   │   ├── taskPrompts.ts
│   │   └── researchPrompts.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── README.md

```

---

### Key Features

| Tool | Core Capability | Output Deliverables |
| --- | --- | --- |
| **Smart Email Generator** | Generates context-aware drafts based on target audience and tone | Structured email draft with subject line, greeting, CTA, and sign-off |
| **Meeting Notes Summarizer** | Parses raw meeting notes or conversation transcripts | Executive Summary, Key Decisions, Action Items with Assignees and Deadlines |
| **AI Task Planner** | Breaks high-level objectives into prioritized workflows | Eisenhower Matrix or sequential timeline with time estimates and dependencies |
| **AI Research Assistant** | Synthesizes industry trends, technical docs, and competitive queries | Key takeaways, SWOT analysis, and structured bullet breakdowns |
| **Copilot Chatbot** | Real-time interactive conversational partner | Contextual task handling, drafting, rewriting, and brainstorming |

---

### Tech Stack

* **Frontend Framework:** React 18 / Next.js (TypeScript)
* **Styling & Icons:** Tailwind CSS, Lucide React
* **State Management:** React Hooks / Zustand
* **AI Integration:** OpenAI API / Anthropic Claude / Gemini REST API endpoints
* **Markdown Rendering:** `react-markdown` with `remark-gfm`

---

### Prompt Engineering Architecture

Each module utilizes a strict system prompt architecture to ensure deterministic, hallucination-resistant outputs:

```typescript
// Example: Meeting Summarizer Prompt Schema
export const MEETING_SUMMARIZER_PROMPT = (transcript: string) => `
You are an executive operational assistant. Analyze the following meeting transcript:

"""
${transcript}
"""

Format your response strictly using this Markdown template:
## 1. Executive Summary (Max 3 sentences)
## 2. Key Decisions Made
- [Decision] (Rationale if stated)
## 3. Action Item Matrix
| Action Item | Assignee | Priority (High/Med/Low) | Deadline |
|---|---|---|---|
`;

```

---

### Getting Started

#### Prerequisites

* Node.js `>= 18.0.0`
* npm `>= 9.0.0` or pnpm `>= 8.0.0`

#### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-org/ai-workplace-assistant.git
cd ai-workplace-assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

```

#### Environment Variables (`.env.local`)

```ini
VITE_AI_API_KEY=your_api_key_here
VITE_AI_MODEL=gpt-4o-mini

```

#### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

```

---

### Compliance & Safety Notice

> **Disclaimer:** AI-generated content may contain inaccuracies and requires human verification prior to client distribution or executive sign-off.
