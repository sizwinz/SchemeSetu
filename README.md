<div align="center">

# SchemeSetu

### AI-Driven Scheme Matching & Channel Finance Routing Platform
**Smart India Hackathon 2026 | Problem Statement ID: 26092 | Theme: Smart Automation | Team: TechBizz**  
*Ministry of Social Justice and Empowerment (MoSJE) & National Scheduled Castes Finance and Development Corporation (NSFDC)*

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-65%20Passed-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![MoSJE](https://img.shields.io/badge/Affirmative%20Credit-MoSJE%20%2F%20NSFDC-amber?style=flat-square)](https://socialjustice.gov.in/)
[![Privacy](https://img.shields.io/badge/Privacy-DPDP%20Act%202023%20Compliant-emerald?style=flat-square)](#)

<p align="center">
  Connecting Scheduled Caste (SC) entrepreneurs and students with tailored concessional credit schemes (covering up to 90% of project costs at 4.0% to 8.0% interest rates) through financially solvent, low-NPA Channel Partners.
</p>

[Key Deliverables](#-the-three-mandated-deliverables) •
[8-Step Journey](#-the-8-step-beneficiary-delivery-journey) •
[Competitor Benchmark](#-competitor-benchmark--systemic-gaps) •
[Statutory Schemes](#-statutory-concessional-schemes) •
[Channel Finance Network](#-channel-finance-partner-network) •
[Feasibility & Mitigations](#-feasibility-challenges--mitigations) •
[Quickstart](#-getting-started) •
[Verification](#-automated-verification)

</div>

---

## Executive Summary

Under statutory guidelines from the **Ministry of Social Justice and Empowerment (MoSJE)** and the **National Scheduled Castes Finance and Development Corporation (NSFDC)**, concessional credit cannot be disbursed directly by the ministry to individual bank accounts. Instead, affirmative credit must flow through an accredited **Channel Finance System** (SCAs, PSBs, RRBs, and NBFC-MFIs).

In practice, applicants face severe friction:
1. **Application Misrouting:** Beneficiaries apply directly to bank branches that do not operate the required affirmative credit windows or have exhausted their statutory lending quotas.
2. **NPA & Overdue Bottlenecks:** Applications routed to institutional branches with high Non-Performing Asset (NPA > 10%) ratios or overdue burdens get stalled or rejected outright.
3. **Information Asymmetry:** Semi-literate and vernacular applicants struggle to navigate complex loan terms, interest subventions, and gestation moratorium allowances.
4. **Third-Party Intermediaries:** Heavy dependence on commission-seeking middlemen leads to leakage and delays.

**SchemeSetu** solves this systemic delivery bottleneck with an end-to-end digital pipeline: from intelligent, vernacular-accessible scheme matching to dynamic EMI simulation, solvent partner branch routing, and cryptographic tamper-proof application packets.

---

## The Three Mandated Deliverables

### Deliverable 1: Smart Scheme Recommender
- **Multi-Factor Matcher with Match Score:** Evaluates enterprise activity, project cost, annual family income, and demographic quota in real time, calculating a granular **Match Score (up to 99%)**.
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

## The 8-Step Beneficiary Delivery Journey

```
[1. Voice/Chat Intake] ──► [2. Multilingual AI] ──► [3. Eligibility Check] ──► [4. Scheme Match Score]
                                                                                       │
[8. QR Dossier & PM-SURAJ] ◄── [7. Solvent Partner] ◄── [6. DigiLocker Sync] ◄── [5. EMI & Moratorium]
```

1. **User Voice / Chat Intake:** Vernacular speech input in local dialects or natural language chat without complex forms.
2. **Multilingual AI Interaction:** Context-aware assistant guides applicant across 9 official Indian languages.
3. **Eligibility Analysis:** Real-time audit against the statutory ₹5.00 Lakhs income ceiling and SC affirmative quotas.
4. **Scheme Recommendation + Match Score:** Deterministic fit scoring (up to 99%) and transparent 90% funding split.
5. **EMI & Moratorium Calculation:** Parametric loan amortization with 3 to 12 months ₹0-principal grace periods.
6. **Document Support via DigiLocker:** Consent-based sync of caste certificate, Aadhaar, and income proof without intermediaries.
7. **Nearest Eligible Channel Partner:** Geo-spatial router directs to solvent (<10% NPA) SCA/bank branches with active lending quotas.
8. **Application Tracking & PM-SURAJ:** Verifiable Level-H QR dossier handoff and countertop branch verification desk.

---

## Competitor Benchmark & Systemic Gaps

SchemeSetu addresses critical functional gaps across existing government portals and civic-tech apps:

| Key Evaluation Criteria | PM-SURAJ (MoSJE) | myScheme (MeitY) | JanSamarth (DFS) | Haqdarshak (Private) | SchemeSetu (TechBizz) |
|---|:---:|:---:|:---:|:---:|:---:|
| **MoSJE Channel Finance Routing** | Partial | No | No | No | **Yes (Full)** |
| **Operational Partner Solvency Filter (<10% NPA)** | No | No | No | No | **Yes (<10% NPA)** |
| **Voice-First Vernacular Interaction** | No | No | No | Field Agents Only | **Yes (9 Languages)** |
| **Subsidized EMI & Moratorium Gestation** | No | No | Basic Commercial | No | **Yes (3-12 Mo Grace)** |
| **Zero-Intermediary Cryptographic QR Dossier** | No | No | No | No | **Yes (Level-H QR)** |
| **DPDP Act, 2023 Local Privacy Architecture** | Centralized | Centralized | Centralized | Human Intermediaries | **Yes (Client-Side)** |
| **Zero Cloud Inference Expense** | N/A | N/A | N/A | High Field Cost | **Yes (Local AI / PWA)** |

### Institutional Insights
- **PM-SURAJ Portal:** Official MoSJE portal for credit assistance up to ₹15L, but relies on traditional web forms with no voice guidance and does not filter branches by operational NPA/overdue quotas.
- **myScheme:** Informational directory covering 4,700+ schemes that redirects users to external sites without financial calculation or branch routing.
- **JanSamarth Portal:** Built around Scheduled Commercial Banks; does not cater to the specialized MoSJE Channel Finance System (SCAs, NBFC-MFIs) or dialect voice accessibility.
- **Haqdarshak:** Heavy reliance on human field agents (Haqdarshikas) increases operational costs and processing time without institutional lender solvency integration.

---

## Feasibility, Challenges & Mitigations

| Challenge | Impact | SchemeSetu Mitigation |
|---|---|---|
| **Scheme Rules Change Periodically** | Risk of obsolete guidelines | Versioned scheme database with effective dates and admin-editable parameter schemas. |
| **AI May Provide Incorrect Information** | Hallucinations leading to misrouting | Rule engine + grounded retrieval-augmented generation (RAG) with direct citations to official NSFDC circulars. |
| **Sensitive Socio-Economic Data** | Privacy compliance violation | DPDP Act, 2023 compliance via client-side data minimization, zero cloud token logging, and cryptographic verification. |
| **Partner Quotas & NPA Changes** | Outdated branch health | Administrative governance portal allowing real-time adjustments to statutory NPA ceilings (5% to 15%) and lending quotas. |
| **Low Digital & Literacy Levels** | Application abandonment | Voice-first vernacular interface, read-aloud text-to-speech audio controller, and intuitive icon-driven micro-widgets. |
| **Limited Internet in Rural Areas** | Connectivity dropouts | Offline-first Progressive Web App (PWA) architecture caching core rule schemas locally for 2G/low-bandwidth resilience. |
| **Dialect & Language Ambiguity** | Translation misinterpretation | Dual verification engine: multilingual client engine synchronized with native regional Web Speech locales. |

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

## Regulatory & Legal Alignment

- **Governing Ministry:** Ministry of Social Justice and Empowerment (MoSJE), Government of India
- **Implementing Agency:** National Scheduled Castes Finance and Development Corporation (NSFDC)
- **Applicable Problem Statement:** Smart India Hackathon 2026, Problem Statement ID 26092
- **Data Privacy:** Digital Personal Data Protection Act (DPDP Act), 2023 compliance via client-side data minimization.
- **Integration Ecosystem:** Non-invasive integration with PM-SURAJ and DigiLocker APIs.
