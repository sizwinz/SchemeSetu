<div align="center">

# SchemeSetu

### AI-Driven Scheme Matching & Channel Finance Routing Platform
**Ministry of Social Justice and Empowerment (MoSJE) | Problem Statement ID: 26092**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-65%20Passed-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![MoSJE](https://img.shields.io/badge/Affirmative%20Credit-MoSJE%20%2F%20NSFDC-amber?style=flat-square)](https://socialjustice.gov.in/)
[![License](https://img.shields.io/badge/License-Proprietary-slate?style=flat-square)](#)

<p align="center">
  Connecting Scheduled Caste (SC) entrepreneurs and students with tailored concessional credit schemes (covering up to 90% of project costs at 4.0% to 8.0% interest rates) through financially solvent, low-NPA Channel Partners.
</p>

[Key Deliverables](#-the-three-mandated-deliverables) •
[Core Architecture](#-architecture--pipeline) •
[Statutory Schemes](#-statutory-concessional-schemes) •
[Channel Finance System](#-channel-finance-partner-network) •
[Quickstart](#-getting-started) •
[Verification](#-automated-verification)

</div>

---

## Executive Summary

Under statutory mandates from the **Ministry of Social Justice and Empowerment (MoSJE)** and the **National Scheduled Castes Finance and Development Corporation (NSFDC)**, concessional credit cannot be disbursed directly by the ministry to individual bank accounts. Instead, affirmative credit must flow through an accredited **Channel Finance System** (SCAs, PSBs, RRBs, and NBFC-MFIs).

In practice, applicants face severe friction:
1. **Application Misrouting:** Beneficiaries apply directly to bank branches that do not operate the required affirmative credit windows or have exhausted their statutory lending quotas.
2. **NPA & Overdue Bottlenecks:** Applications routed to institutional branches with high Non-Performing Asset (NPA > 10%) ratios get stalled or rejected outright.
3. **Information Asymmetry:** Semi-literate and vernacular applicants struggle to navigate complex loan terms, interest subventions, and gestation moratorium allowances.

**SchemeSetu** solves this systemic delivery bottleneck with an end-to-end digital pipeline: from intelligent, vernacular-accessible scheme matching to dynamic EMI simulation, solvent partner branch routing, and cryptographic tamper-proof application packets.

---

## The Three Mandated Deliverables

### Deliverable 1: Smart Scheme Recommender
- **Multi-Factor Deterministic Matcher:** Evaluates enterprise activity, project cost, annual family income, and demographic quota in real time.
- **Statutory Ceiling Enforcement:** Validates the statutory ₹5.00 Lakhs annual family income ceiling and caps funding recommendations strictly within NSFDC limits.
- **Concessional Funding Breakdown:** Transparently computes the statutory financial breakdown:
  - **NSFDC Concessional Share:** Up to 90% of total project cost.
  - **Channel Partner Share:** 5% institutional co-financing.
  - **Promoter Contribution:** 5% beneficiary equity.
- **Vernacular Voice Input:** Native Web Speech API speech-to-text integration enabling semi-literate users to state their enterprise needs verbally.

### Deliverable 2: Concessional Loan & Moratorium Financial Calculator
- **Statutory Subsidized Rates:** Calibrated for 4.0% (Mahila Samriddhi Yojana for women) to 8.0% (Term Loan Scheme for machinery and capital goods).
- **Grace Period (Moratorium) Modeling:** Accurate reducing-balance amortization accounting for 3 to 12 month gestation periods where applicants pay ₹0 principal.
- **Commercial Relief Calculator:** Quantifies lifetime interest savings by benchmarking concessional loans against commercial bank rates (14% p.a.) and unregulated micro-lenders (18% p.a.).
- **Amortization Breakdown:** Generates transparent Annual Summaries and Monthly schedules with one-click CSV export.

### Deliverable 3: Geo-Spatial Partner Locator & NPA Solvency Router
- **Channel Finance Institutional Filter:** Maps and categorizes all 4 statutory institution types:
  - **SCAs:** State Channelizing Agencies
  - **PSBs:** Public Sector Banks (SBI, PNB, Canara Bank)
  - **RRBs:** Regional Rural Banks
  - **NBFC-MFIs:** Microfinance Institutions
- **NPA Solvency Firewall:** Evaluates branch-level health in real time:
  - **Solvent (<10% NPA):** Allowed and prioritized in search rankings.
  - **High-Risk (>10% NPA):** Filtered out to protect applicants from stalled applications.
- **Live Branch Coordinates:** Haversine spherical distance calculation with interactive Leaflet map tiles and Google Maps turn-by-turn routing.

---

## Additional Enterprise Features

### Multilingual Support & Real-Time DOM Translation
- **Accessible Language Selector:** Dropdown supporting 9 major Indian languages:
  - English
  - हिन्दी (Hindi)
  - मराठी (Marathi)
  - தமிழ் (Tamil)
  - తెలుగు (Telugu)
  - বাংলা (Bengali)
  - ગુજરાતી (Gujarati)
  - ಕನ್ನಡ (Kannada)
  - ਪੰਜਾਬੀ (Punjabi)
- **Synchronous Speech Synthesis:** Automatically recalibrates the Web Speech voice engine to the chosen regional locale.
- **Zero-Flicker Audio Controller:** Single-line top header pill for reading aloud page text without UI distortion.

### Conversational AI Assistant
- Context-aware pre-screening agent guiding applicants through income, caste, and enterprise inputs conversationally.
- Inline micro-widgets render scheme match summaries directly inside the message flow.

### Verifiable Application Dossier & Level-H QR
- Client-side generation of official, printable A4 pre-screening packets with designated branch routing slips.
- Encodes a 32-bit FNV-1a cryptographic checksum to detect client-side payload tampering.
- Countertop QR verification desk for credit officers to scan and authenticate application packets offline.

### MoSJE National Governance Portal
- Ministry dashboard with macro KPIs: total pre-screened leads, credit volume sanctioned, and lending quota utilization.
- Interactive Statutory NPA Ceiling Policy Governor (5.0% to 15.0%) for real-time stress testing of national partner solvency.
- 4-stage branch lead queue (`PRE_SCREENED` -> `DOCUMENTS_VERIFIED` -> `CREDIT_SANCTIONED` -> `DISBURSED`).

---

## Architecture & Pipeline

```
[ Beneficiary / Entrepreneur ]
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│              SchemeSetu Digital Pipeline                │
├─────────────────────────────────────────────────────────┤
│ 1. Smart Scheme Recommender (Voice & Criteria Match)    │
│    └─ Validates ₹5L income limit & 90% funding split    │
│                                                         │
│ 2. Concessional Loan Calculator (4.0% - 8.0% Subsidized)│
│    └─ Simulates EMI, 3-12 mo moratorium & relief       │
│                                                         │
│ 3. Solvency Router & Geo-Spatial Locator (<10% NPA)     │
│    └─ Routes to solvent SCA, PSB, RRB, or NBFC-MFI      │
│                                                         │
│ 4. Verifiable Pre-Screened QR Application Dossier       │
│    └─ Level-H QR code with FNV-1a cryptographic hash    │
└─────────────────────────────────────────────────────────┘
               │
               ▼
[ Solvent Channel Partner Branch: Credit Officer Desk ]
               │
               ▼
[ Ministry of Social Justice & Empowerment (MoSJE) Governance ]
```

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx             # Root layout with LanguageProvider and global audio
│   ├── page.tsx               # Homepage: Hero, Recommender, Schemes, Channel Explainer
│   ├── assistant/             # AI Scheme Assistant (voice & chat pre-screening)
│   ├── calculator/            # Standalone loan, moratorium, and amortization calculator
│   ├── locator/               # Interactive Leaflet map and solvent branch router
│   ├── dossier/               # Verifiable pre-screened application dossier & QR
│   └── admin/                 # MoSJE governance dashboard and branch officer queue
├── components/
│   ├── admin/                 # QrVerificationDesk, BranchLeadQueue, MinistryGovernance
│   ├── calculator/            # LoanSliders, FinancialSummaryCard, AmortizationTable
│   ├── chat/                  # ChatContainer, MessageStream, InlineSchemeWidget
│   ├── dossier/               # DossierQR, DocumentChecklist
│   ├── home/                  # SmartRecommenderWizard, ChannelFinanceExplainer, SchemesGrid
│   ├── layout/                # Header, LanguageDropdown, BottomNav, Footer
│   └── locator/               # PartnerMap, PartnerCard, PartnerFilter
└── lib/
    ├── admin/                 # Lead lifecycle management, pre-seeded catalog, KPI engine
    ├── audio/                 # Web Speech API speech synthesis & single-line audio controller
    ├── calculator/            # Reducing-balance EMI, moratorium interest, commercial relief
    ├── chat/                  # State machine and conversational dialog engine
    ├── dossier/               # Dossier contracts and FNV-1a cryptographic checksum engine
    ├── i18n/                  # LanguageProvider, locale management, and translation sync
    ├── partners/              # 30+ pre-seeded branches, Haversine formula, solvency scoring
    └── schemes/               # NSFDC statutory schemes rules engine and criteria predicates
```

---

## Statutory Concessional Schemes

| Scheme Code | Scheme Name | Max Project Limit | Subsidized Interest Rate | Repayment Tenure | Moratorium Period | Target Beneficiary |
|---|---|---|---|---|---|---|
| **MSY** | Mahila Samriddhi Yojana | ₹1,40,000 | 4.0% p.a. | Up to 3 Years | 6 Months | SC Women Micro-Entrepreneurs |
| **MCF** | Micro Credit Finance | ₹1,40,000 | 6.5% p.a. | Up to 3 Years | 3 Months | Small Vendors, Kiosks, Retail Units |
| **TLS** | Term Loan Scheme | ₹50,00,000 | 8.0% p.a. | Up to 5 Years | Up to 12 Months | Transport Vehicles, Machinery, Industry |
| **ELS** | Education Loan Scheme | ₹40,00,000 | 6.5% p.a. (Women: 6.0%) | Up to 5 Years | 12 Months Post-Study | Technical & Professional Higher Studies |

*Note: All schemes enforce the statutory ₹5.00 Lakhs annual family income ceiling pursuant to MoSJE/NSFDC guidelines.*

---

## Channel Finance Partner Network

Direct applications to the Ministry are not accepted. Concessional credit must be disbursed through verified Channel Partners:

1. **State Channelizing Agencies (SCAs):** State-level socio-economic development corporations managing direct micro-credit and women empowerment schemes.
2. **Public Sector Banks (PSBs):** Nationalized commercial lenders (State Bank of India, Punjab National Bank, Canara Bank) processing medium-to-large Term Loans and Education Loans.
3. **Regional Rural Banks (RRBs):** Grassroots banking institutions servicing agricultural, dairy, and rural transport enterprise loans in semi-urban and rural areas.
4. **Microfinance Institutions (NBFC-MFIs):** Accredited microfinance institutions delivering rapid group micro-credit directly to self-help groups.

### Solvency Scoring Algorithm

$$\text{Health Score} = (\text{NPA Weight} \times S_{\text{NPA}}) + (\text{Quota Weight} \times S_{\text{Quota}}) + (\text{Speed Weight} \times S_{\text{Speed}})$$

- **Solvent (80 - 100):** NPA < 5.0%, Quota > ₹10.0L, Turnaround <= 15 days. Approved for immediate routing.
- **Moderate (50 - 79):** NPA 5.0% - 10.0%, Quota active. Routed with caution notification.
- **High-Risk (0 - 49):** NPA > 10.0% or Quota exhausted. Automatically filtered from beneficiary recommendations.

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm, pnpm, or yarn

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/sizwinz/SchemeSetu.git
cd SchemeSetu

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Automated Verification

SchemeSetu maintains a comprehensive Vitest test suite verifying mathematical calculations, eligibility rules, and security checksums:

```bash
npx vitest run
```

```
Test Files: 7 passed (7)
Tests:      65 passed (65)
Duration:   ~800ms
```

- `tests/calculator/engine.test.ts` (11 tests): Reducing-balance EMI, moratorium interest, and commercial relief math.
- `tests/schemes/engine.test.ts` (8 tests): Eligibility evaluation, income ceiling validation, and funding breakdown.
- `tests/schemes/data.test.ts` (6 tests): Statutory scheme data integrity and rate boundaries.
- `tests/partners/engine.test.ts` (11 tests): Haversine distance calculations and institutional health scoring.
- `tests/dossier/engine.test.ts` (12 tests): Cryptographic checksum generation and tamper detection.
- `tests/admin/engine.test.ts` (9 tests): Lead state transitions and statutory NPA ceiling policy changes.
- `tests/chat/dialogEngine.test.ts` (8 tests): Conversational state machine and profile extraction.

---

## Regulatory Alignment

- **Governing Ministry:** Ministry of Social Justice and Empowerment (MoSJE), Government of India
- **Implementing Agency:** National Scheduled Castes Finance and Development Corporation (NSFDC)
- **Applicable Problem Statement:** Smart India Hackathon 2026, Problem Statement ID 26092
- **Data Privacy:** Client-side data minimization for sensitive socio-economic and income declarations.
