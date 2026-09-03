# SchemeSetu

**AI-Driven Scheme Matching & Affirmative Action Credit Platform**  
*Ministry of Social Justice and Empowerment (MoSJE) - Smart India Hackathon (SIH 2026 Problem Statement 26092)*

---

## Overview

SchemeSetu is an intelligent digital platform and mobile-first PWA engineered for the Ministry of Social Justice and Empowerment (MoSJE) and the National Scheduled Castes Finance and Development Corporation (NSFDC). 

The platform bridges the critical delivery gap connecting Scheduled Caste (SC) entrepreneurs and students with government concessional credit (covering up to 90% of project costs at 4% to 8% interest rates). It resolves offline bureaucratic confusion, misrouted applications, and disbursement bottlenecks through:

1. **Conversational AI & Voice Assistant:** Multilingual, vernacular voice recognition and text-to-speech assistant with interactive inline micro-widgets.
2. **Deterministic Scheme Rules Engine:** Real-time eligibility evaluation for NSFDC concessional loan schemes (Mahila Samriddhi Yojana, Micro Credit Finance, Term Loans, and Educational Loans).
3. **Dynamic Financial & Moratorium Calculator:** Parametric reducing-balance EMI calculations with 3 to 12 month moratorium gestation schedules and commercial loan savings comparison.
4. **Geo-Spatial Partner Locator & Health Router:** Interactive Leaflet mapping connecting beneficiaries to 30+ pre-seeded institutions (SCAs, PSBs, RRBs, NBFC-MFIs) across 15+ Indian district hubs, algorithmically filtering out high-NPA (>10%) or quota-depleted branches.
5. **Verifiable Application Dossier & Level-H QR:** Tamper-resistant application packets with 32-bit cryptographic checksums, printable A4 official routing slips with officer seal containers, and an interactive statutory compliance checklist.
6. **Administrative & MoSJE Governance Portal:** Dual-role control center featuring branch-level lead queues with 4-stage lifecycle progression, countertop QR verification desk, and an interactive Statutory NPA Ceiling Policy Governor (5% to 15%).

---

## Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components, TypeScript)
- **UI & Styling:** React 19, Tailwind CSS, Lucide React
- **Voice & Accessibility:** Native Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Geo-Spatial Mapping:** Leaflet & OpenStreetMap tiles (SSR-safe dynamic DOM integration)
- **Verification & Cryptography:** FNV-1a 32-bit cryptographic hashing, `qrcode.react` (Level-H error correction)
- **Testing:** Vitest 2.x (65 unit tests, 100% pass rate)

---

## Architecture & Core Modules

```
src/
├── app/
│   ├── layout.tsx             # Root layout with MoSJE navigation header and bottom bar
│   ├── page.tsx               # Scheme exploration catalog and affirmative action showcase
│   ├── assistant/             # Conversational voice and chat assistant interface
│   ├── calculator/            # Standalone loan, moratorium, and amortization calculator
│   ├── locator/               # Geo-spatial interactive map and solvent partner router
│   ├── dossier/               # Verifiable pre-screened application dossier (A4 print layout)
│   └── admin/                 # Branch officer lead queue and MoSJE ministry governance
├── components/
│   ├── admin/                 # QrVerificationDesk, BranchLeadQueue, MinistryGovernance
│   ├── calculator/            # EmiCalculator, MoratoriumBreakdown, AmortizationSchedule
│   ├── chat/                  # ChatContainer, MessageStream, InlineSchemeWidget
│   ├── dossier/               # DossierQR, DocumentChecklist
│   ├── layout/                # Header, BottomNav
│   └── locator/               # PartnerMap, PartnerCard, PartnerFilter
└── lib/
    ├── admin/                 # Lead domain models, pre-seeded catalog, lifecycle engine
    ├── calculator/            # Loan amortization and moratorium interest calculations
    ├── chat/                  # State machine and conversational dialog engine
    ├── dossier/               # Application dossier contracts and cryptographic checksum engine
    ├── partners/              # Partner catalog, Haversine spherical distance, health scoring
    └── schemes/               # NSFDC statutory scheme specifications and rules engine
```

---

## Key Features

### 1. Conversational Voice Assistant
- Voice-first interface powered by the Web Speech API with bidirectional Hindi and English speech recognition and synthesis.
- Context-aware state machine dynamically guides applicants through income, caste, and enterprise inputs without cumbersome multi-page forms.
- Dispatches interactive inline micro-widgets directly into the chat stream.

### 2. Algorithmic Channel Partner Health Router
- Geo-spatial proximity calculation via the Haversine spherical formula.
- Tri-tier institutional health scoring:
  - **Solvent:** NPA < 5.0%, Quota > ₹10.0L, Turnaround <= 15 days (Score: 80 - 100)
  - **Moderate:** NPA 5.0% - 10.0% (Score: 50 - 79)
  - **High-Risk / Depleted:** NPA > 10.0% or Quota = ₹0.0L (Auto-filtered from default routing)
- Persistent 1-click partner designation saved to local storage for automatic dossier routing.

### 3. Verifiable Application Dossier & Checksum Verification
- Generates an official, printable A4 application slip with official MoSJE emblem, applicant demographics, concessional loan breakdown, and designated branch routing slip.
- Embeds high-density Level-H error-corrected vector QR code.
- Protected against client-side tampering through an 8-character uppercase hexadecimal FNV-1a checksum binding application ID, scheme code, loan sum, EMI, and branch ID.
- Countertop verification desk enables credit officers to instantly scan or paste QR tokens and verify authentic payloads or detect tampered parameters.

### 4. MoSJE National Governance & Policy Governor
- Macro KPI cards displaying national pre-screened leads, total concessional credit sanctioned, average turnaround days, and lending quota utilization.
- Interactive Statutory NPA Ceiling Policy Governor (5.0% to 15.0%) allowing ministry administrators to stress-test and re-tier national partner solvency in real time.
- 4-stage branch lead queue (`PRE_SCREENED` -> `DOCUMENTS_VERIFIED` -> `CREDIT_SANCTIONED` -> `DISBURSED`) with automatic lending quota decrements upon credit sanction.

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sizwinz/SchemeSetu.git
   cd SchemeSetu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build production bundle:
   ```bash
   npm run build
   ```

5. Run automated test suite:
   ```bash
   npm test
   ```

---

## Test Verification

SchemeSetu includes 65 unit tests covering all domain models, calculation formulas, eligibility predicates, and cryptographic verification algorithms:

```
✓ tests/calculator/engine.test.ts (11 tests)
✓ tests/schemes/data.test.ts (6 tests)
✓ tests/dossier/engine.test.ts (12 tests)
✓ tests/schemes/engine.test.ts (8 tests)
✓ tests/partners/engine.test.ts (11 tests)
✓ tests/admin/engine.test.ts (9 tests)
✓ tests/chat/dialogEngine.test.ts (8 tests)

Test Files: 7 passed (7)
Tests:      65 passed (65)
```

---

## Statutory Scheme Reference

All scheme guidelines, interest rates, and loan limits are parameterized directly from official publications:
- Ministry of Social Justice and Empowerment (MoSJE), Government of India
- National Scheduled Castes Finance and Development Corporation (NSFDC) Guidelines
- Credit Enhancement Guarantee Scheme for Scheduled Castes (CEGSSC)
- Venture Capital Fund for Scheduled Castes (VCF-SC)

---

## License

This project is developed for the Smart India Hackathon (SIH 2026) under the guidance of the Ministry of Social Justice and Empowerment (MoSJE).
