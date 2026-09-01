<!-- GSD:project-start source:PROJECT.md -->
## Project

**SchemeSetu: AI-Driven Scheme Matching for Marginalized Entrepreneurs**

SchemeSetu is an intelligent, multilingual, context-aware digital platform and mobile-first PWA designed for the Ministry of Social Justice and Empowerment (MoSJE). It connects Scheduled Caste (SC) entrepreneurs and students with tailored concessional credit and educational loan schemes (covering up to 90% of costs at 6.5% to 8% interest rates). The platform features an AI context-aware, voice-first and chat-first conversational assistant with interactive inline micro-widgets, dynamic EMI and moratorium financial calculators, and a geo-spatial Channel Partner router that filters out high-NPA or overdue-burdened institutions.

**Core Value:** Eliminate offline confusion, misrouted applications, and disbursement bottlenecks by providing conversational scheme matching and intelligent routing to verified, financially sound Channel Partners.

### Constraints

- **Accessibility**: First-class voice recognition and speech synthesis support to accommodate semi-literate and vernacular language users.
- **Platform Parity**: High responsiveness and tactile performance across mobile viewports (PWA) and desktop administrative browsers.
- **Data Privacy**: Client-side data minimization for sensitive socio-economic and income declarations.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|---|---|---|---|
| Next.js (App Router) | 15.x | Unified Fullstack Web Framework | Provides server components, fast routing, built-in API route handlers, and automatic static optimization for low-bandwidth devices. |
| React | 19.x / 18.3 | Client UI Component Library | Industry standard declarative UI with component lifecycle optimized for interactive chat, widgets, and dynamic calculators. |
| TypeScript | 5.6+ | Type Safety and Data Contracts | Strictly defines domain models (Schemes, Channel Partners, User Profiles, Loan Applications) preventing runtime errors across client/server. |
| Tailwind CSS | 3.4+ / 4.x | Utility-First Responsive Styling | Enables rapid, consistent UI with zero runtime CSS overhead, accessible typography, and mobile/desktop parity. |
| Web Speech API | Native Browser Spec | Speech Recognition and Voice Synthesis | Native browser API (SpeechRecognition + SpeechSynthesis) providing zero-dependency, zero-latency speech input and playback without API billing. |
| Leaflet & React-Leaflet | 1.9.4 & 4.2.1 | Geo-Spatial Interactive Maps | Lightweight open-source mapping (OpenStreetMap tiles) requiring no costly Google Maps API keys; works cleanly in offline and mobile views. |
| QRCode (qrcode.react) | 4.0+ | Verifiable Application QR Generation | Client-side SVG/Canvas QR rendering for verifiable offline-friendly pre-screened application packets. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---|---|---|---|
| Lucide React | 0.460+ | Modern Iconography | Clear visual iconography for semi-literate users across scheme cards, navigation, and badges. |
| Radix UI / Shadcn UI | Latest | Accessible Headless UI Primitives | Accessible dialogs, sliders, tabs, tooltips, and collapsible accordion elements for calculators and chat widgets. |
| Framer Motion | 11.x | Smooth Layout Transitions | Smooth micro-animations for chat bubbles, collapsible cards, and modal steps without layout jank. |
| Zod | 3.23+ | Schema Validation | Validates user loan inputs, partner records, and API payloads before running matching algorithms. |
### Development Tools
| Tool | Purpose | Notes |
|---|---|---|
| Vitest / Jest | Unit & Algorithm Testing | Automated verification of EMI calculation logic, moratorium interest, and partner health scoring. |
| ESLint & Prettier | Code Quality and Formatting | Enforces clean code guidelines and prevents lint degradation. |
## Installation
# Core framework and UI dependencies
# Headless UI primitives and motion
# Geo-spatial and utility tools
# Dev dependencies and types
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|---|---|---|
| Web Speech API (Native) | Cloud Whisper / ElevenLabs API | When enterprise-grade multi-speaker Hindi/vernacular models with custom acoustic training are mandated and API latency/cost is acceptable. |
| Leaflet + OpenStreetMap | Google Maps JavaScript API | When proprietary Google Places search and turn-by-turn navigation APIs are specifically required and funded. |
| Next.js App Router (Fullstack) | React SPA + Python FastAPI | When heavy deep-learning neural network inference must run directly on the web server backend rather than via client/serverless functions. |
## What NOT to Use
| Avoid | Why | Use Instead |
|---|---|---|
| Heavy monolithic form libraries | Multi-page monolithic forms cause 60%+ abandonment among semi-literate applicants. | Conversational AI chat flow with progressive inline micro-widgets. |
| Client-side Google Maps API without key gating | High risk of quota exhaustion and unauthorized billing on public hackathon deployments. | Leaflet with OpenStreetMap tiles. |
| Static hardcoded interest tables | Government loan guidelines adjust rates based on gender, quota, and RBI repo rate changes. | Dynamic parameterized scheme rule engine. |
## Version Compatibility
| Package A | Compatible With | Notes |
|---|---|---|
| react-leaflet@4.2.1 | leaflet@1.9.4 | Ensure Leaflet CSS is imported at the root layout to avoid tile misalignment. |
| next@15.x | react@19.x or react@18.3 | App Router supports React Server Components and modern action hooks seamlessly. |
## Sources
- MoSJE Official Portal (socialjustice.gov.in)
- National Scheduled Castes Finance and Development Corporation (NSFDC Guidelines)
- Web Speech API W3C Specification
- Leaflet.js Documentation
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
