# CivicSignal AI — Master Product & Technical Documentation

**Version:** 1.0
**Status:** Hackathon MVP / implementation-ready specification
**Primary demo geography:** Kolkata, India
**Primary languages:** English, Bengali, Hindi
**Product type:** Multilingual civic demand intelligence and public-infrastructure decision-support platform

---

## 1. Executive Summary

CivicSignal AI converts fragmented citizen voice and text into structured, geographically contextualized civic-demand intelligence.

The platform is designed around the following chain:

```text
Citizen Voice / Text
        ↓
Language Understanding
        ↓
Structured Civic Issue
        ↓
Semantic Similarity / Clustering
        ↓
Geographic Demand Aggregation
        ↓
Demand Hotspots
        ↓
Demographic + Infrastructure + Investment Context
        ↓
Demand / Gap Analysis
        ↓
Transparent Analytical Priority
        ↓
Explainable Candidate Intervention
        ↓
Government Decision Support
```

CivicSignal is **not** an autonomous government decision system. It provides evidence, analysis and candidate interventions; the policymaker or planner remains responsible for the decision.

The current implementation is a React + TypeScript + Vite frontend with local deterministic demo data and an optional server-side Gemini proxy. The project already contains citizen intake, multilingual demo analysis, government dashboard, Leaflet visualization, Recharts analytics, evidence panels, investment-gap views, priority projects and a dataset-grounded government assistant.

---

# 2. Problem Statement

Governments receive citizen development and public-service requests through fragmented channels. These requests may be:

- multilingual
- unstructured
- duplicated
- geographically inconsistent
- difficult to categorize
- difficult to aggregate
- difficult to compare against infrastructure conditions
- difficult to compare against demographic context
- difficult to compare against existing public investment

This creates a gap between citizen voice and public planning:

```text
Raw citizen requests
        ↓
Hard-to-process information
        ↓
Limited geographic visibility
        ↓
Limited context
        ↓
Difficult planning analysis
```

CivicSignal addresses this by transforming requests into structured evidence and presenting the evidence through an explainable government command center.

---

# 3. Product Vision

> **Turning citizen voice into evidence for better public infrastructure.**

The product should help a planner answer:

1. What are citizens reporting?
2. Where are requests concentrated?
3. Which categories dominate each region?
4. How severe are reported issues?
5. Which populations may be affected?
6. What infrastructure conditions surround the demand?
7. What investment is already associated with the region?
8. Where do demand and investment appear mismatched?
9. Why is a region being surfaced?
10. What candidate intervention could address the observed need?

---

# 4. Product Principles

## 4.1 Evidence before conclusion

The dashboard should show the evidence behind an analytical result rather than presenting an unexplained score.

## 4.2 Explainability is structural

Every priority or hotspot must expose the signals contributing to it.

## 4.3 Visible provenance

Synthetic, curated, public and unavailable data must be clearly distinguished.

Never turn missing data into zero.

## 4.4 Advisory, never authoritative

Candidate interventions are suggestions for human review. The platform does not approve, assign or authorize government projects.

## 4.5 Low cognitive load

The dashboard is data-dense but uses progressive disclosure:

```text
Map → Hotspot → Evidence → Requests → Context → Intervention
```

## 4.6 Citizen dignity

Citizens should describe problems naturally rather than learning government taxonomy.

## 4.7 Accessibility is a first-class path

The map must have an equivalent accessible list and detail view.

## 4.8 Calm failure states

Missing data, failed extraction, denied microphone permissions and unavailable AI services should be communicated clearly.

---

# 5. Target Users

## 5.1 Citizen

Submits a development or public-service need in natural language or voice.

Needs:
- low-friction submission
- language support
- confirmation that the request was received
- visibility into what the system understood

## 5.2 Policymaker / Planner

Uses geographic and analytical views to investigate demand patterns and contextual gaps.

Needs:
- map
- filters
- evidence
- infrastructure context
- investment context
- candidate interventions

## 5.3 Analyst

Investigates why a region was surfaced and traces a result back to contributing requests and signals.

---

# 6. Scope

## 6.1 MVP in scope

- Text citizen requests
- Voice-recording UI
- English/Bengali/Hindi demo handling
- Language selection
- Structured AI/demo analysis
- Geographic association
- Demand clustering
- Demand hotspot visualization
- Infrastructure indicators
- Demographic indicators
- Investment indicators
- Demand-investment gap
- Transparent analytical priority model
- Explainable recommendations
- Government command center
- Dataset-grounded AI assistant
- Accessibility support
- Demo-mode operation without external APIs

## 6.2 Out of scope

- Autonomous government decisions
- Full BRICS-wide production deployment
- Full government-system integration
- Custom LLM training
- 20+ language production support
- Full social-media ingestion
- Production messaging-platform integrations
- Satellite/CV analysis
- Complex predictive forecasting

---

# 7. Current Application Architecture

The uploaded project currently uses:

```text
build-with-ai/
└── frontend/
    ├── server/
    │   └── index.mjs
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── types/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── routes.tsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── tsconfig.json
```

The project intentionally retains a React + TypeScript + Vite architecture.

---

# 8. Current Routes

The current router provides:

```text
/                         LandingPage
/submit                   CitizenRequestPage
/submit/:requestId        SubmissionStatusPage
/government/*             GovernmentPage
/method                   MethodPage
/dashboard/*              Redirect → /government
*                         NotFoundPage
```

The legacy `/dashboard` route is retained as a redirect for compatibility.

Government sub-navigation is handled inside `GovernmentPage` through the `/government/*` path.

---

# 9. Frontend Technology Stack

Current dependencies include:

- React 18
- React DOM
- TypeScript
- Vite
- React Router
- Leaflet
- React Leaflet
- Recharts
- Lucide React
- Tailwind CSS
- PostCSS
- Autoprefixer

Leaflet is used for geographic visualization and Recharts is used for analytical charts.

---

# 10. Frontend Structure

## 10.1 Pages

```text
src/pages/
├── LandingPage.tsx
├── CitizenRequestPage.tsx
├── SubmissionStatusPage.tsx
├── GovernmentPage.tsx
├── DashboardPage.tsx
├── MethodPage.tsx
└── NotFoundPage.tsx
```

`GovernmentPage` is the current primary government experience. `DashboardPage` represents the earlier dashboard architecture and should be preserved only where its reusable evidence/map components are still useful.

## 10.2 Layouts

```text
src/layouts/
├── PublicLayout.tsx
├── AnalystLayout.tsx
└── BareLayout.tsx
```

These support separate citizen, analytical and documentation experiences.

## 10.3 Request components

```text
src/components/request/
├── ModeToggle.tsx
├── TextRequestInput.tsx
├── VoiceRecorder.tsx
├── LanguageSelector.tsx
├── LocationInput.tsx
└── RequestStatusCard.tsx
```

## 10.4 Dashboard components

```text
src/components/dashboard/
├── FilterBar.tsx
├── HotspotMap.tsx
├── HotspotList.tsx
└── MapLegend.tsx
```

## 10.5 Evidence components

```text
src/components/evidence/
├── EvidencePanel.tsx
├── DistributionCharts.tsx
├── RequestEvidenceList.tsx
├── ContextPanel.tsx
└── InterventionList.tsx
```

## 10.6 Common / primitive components

The project contains reusable buttons, fields, badges, provenance tags, empty states, error states, loading components, accessibility announcers and toast infrastructure.

---

# 11. Citizen Experience

Route:

```text
/submit
```

## 11.1 Input modes

Two equal modes:

- Type
- Speak

The citizen should not have to select a civic category or severity.

## 11.2 Supported demo languages

- English
- Bengali
- Hindi

Language can be selected explicitly; future versions can add automatic detection.

## 11.3 Location

The demo provides a ward selector. A production version can use geolocation/geocoding.

## 11.4 Example Bengali request

```text
আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।
```

Expected interpretation:

```text
Language: Bengali
Category: Drainage + Roads
Subcategory: Waterlogging + road access
Severity: High
Urgency: High
```

---

# 12. Voice Experience

The current voice component uses the browser MediaRecorder API.

Expected flow:

```text
Idle
 ↓
Request microphone permission
 ↓
Recording
 ↓
Stop
 ↓
Preview
 ↓
Re-record or submit
```

If permission is denied:

```text
Microphone unavailable
        ↓
Clear explanation
        ↓
Return to text input
```

A future production implementation can connect the recorded audio to a speech-to-text provider.

---

# 13. Request Analysis Model

The current civic domain includes:

```text
CivicRequest

id
wardId
ward
category
language
text
severity
urgency
affectedPopulation
date
```

Analysis results include:

```text
AnalysisResult

requestId
language
translatedText
category
subCategory
severity
urgency
wardId
wardName
similarCount
clusterId
affectedPopulation
summary
status
```

---

# 14. Demo AI Architecture

The application has two AI modes.

## 14.1 Demo mode

Default mode.

```env
VITE_AI_MODE=demo
```

The deterministic local analysis service identifies keywords and maps them to categories.

Examples:

```text
waterlogging / জল জম / जलभराव
→ Drainage

road / pothole / রাস্তা / গর্ত / सड़क / गड्ढ
→ Roads

light / streetlight / আলো / लाइट
→ Lighting

waste / garbage / আবর্জনা / कचरा
→ Waste
```

This makes the demo work without internet or an API key.

## 14.2 Real AI mode

```env
VITE_AI_MODE=real
VITE_AI_API_URL=http://localhost:8787
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

The frontend calls the local backend proxy.

The API key remains server-side.

---

# 15. Gemini Proxy

Current server:

```text
server/index.mjs
```

Endpoint:

```text
POST /api/ai/analyse
```

Input:

```json
{
  "text": "...",
  "language": "bn",
  "wardId": "WARD-12"
}
```

Expected structured output:

```json
{
  "language": "bn",
  "translatedText": "...",
  "category": "Drainage",
  "subCategory": "Waterlogging",
  "severity": "high",
  "urgency": 9,
  "wardId": "WARD-12",
  "wardName": "Ballygunge",
  "similarCount": 412,
  "clusterId": "CL-204",
  "affectedPopulation": 18400,
  "summary": "...",
  "status": "analysed"
}
```

Production hardening should later add authentication, validation, rate limiting, strict schema validation and restricted CORS.

---

# 16. Demo Dataset

The current README states that the demo contains:

- 128 synthetic citizen requests
- 20 Kolkata wards
- multiple languages
- infrastructure indicators
- simulated investment records
- demand clusters
- calculated project recommendations

The dataset is explicitly synthetic and must never be presented as official government statistics.

The demo wards include areas such as:

- Salt Lake
- New Town
- Dum Dum
- Kestopur
- Lake Town
- Rajarhat
- Behala East
- Behala West
- Jadavpur
- Garia
- Tollygunge
- Ballygunge
- Park Circus
- Topsia
- Entally
- Garden Reach
- Alipore
- Shyambazar
- Belgachia
- Tangra

---

# 17. Infrastructure Model

Current infrastructure indicators include:

```text
roadQuality
drainageCoverage
waterAccess
electricityAccess
internetAccess
hospitalDensity
schoolDensity
publicTransportAccess
```

Each demo record carries simulated provenance.

Example:

```json
{
  "wardId": "WARD-12",
  "roadQuality": 48,
  "drainageCoverage": 42,
  "waterAccess": 78,
  "electricityAccess": 96,
  "internetAccess": 72,
  "provenance": "simulated"
}
```

---

# 18. Investment Model

Investment records contain:

```text
wardId
sector
allocatedBudget
activeProjects
completionPercentage
provenance
```

The current demo uses simulated budgets.

The dashboard should clearly communicate that investment values are not official spending figures.

---

# 19. Demand Clustering

A demand cluster groups related requests within a geographic and semantic context.

Example:

```text
Request A:
Road near school has potholes.

Request B:
Dangerous potholes outside school.

Request C:
School road needs repair.

              ↓

Demand Cluster CL-204

3 related reports
1 underlying issue
```

The production implementation should use embeddings or another semantic similarity mechanism rather than relying only on keyword matching.

---

# 20. Demand Hotspots

A hotspot is a geographic region with a meaningful concentration of citizen demand.

The dashboard should show:

- total requests
- dominant category
- severity distribution
- demand density
- population denominator
- geographic context
- related clusters

The map and accessible list must communicate the same information.

---

# 21. Government Command Center

Primary route:

```text
/government
```

Current navigation contains:

```text
Overview
Demand Hotspots
Infrastructure Gaps
Investment Gaps
Priority Projects
Citizen Requests
AI Assistant
```

## 21.1 Overview

The overview contains:

- KPI cards
- demand map
- selected region detail
- priority evidence
- recommendation
- trend charts
- issue distribution

## 21.2 Demand Hotspots

Geographic visualization of citizen demand.

## 21.3 Infrastructure Gaps

Shows infrastructure indicators and analytical gap signals.

## 21.4 Investment Gaps

Compares citizen demand with simulated investment and completion.

## 21.5 Priority Projects

Shows candidate intervention recommendations.

## 21.6 Citizen Requests

Searchable structured request table.

## 21.7 AI Assistant

Answers questions using the structured demo dataset rather than generic chatbot knowledge.

---

# 22. Map Specification

The current government dashboard uses React Leaflet.

Map center is Kolkata and the demo wards are represented using ward centroids/circle markers.

The map should communicate:

- region
- request volume
- analytical priority
- selected state

Future enhancement:

Replace centroid-only representation with verified GeoJSON ward boundaries.

The existing legacy `HotspotMap` component has a Bengaluru default center from the earlier documentation baseline. This must be reconciled with the current Kolkata demo and changed to Kolkata if that component remains in use.

---

# 23. Demand vs Investment

This is a core differentiator.

The system compares:

```text
Citizen demand
        vs
Investment coverage
```

Example:

```text
Drainage

Demand: 81/100
Investment coverage: 32/100

Gap signal: 49
```

The value is an analytical signal, not proof of policy failure.

The UI should say:

> Potential demand-investment mismatch for human review.

---

# 24. Priority Model

The current analytical model uses:

```text
30% Citizen Demand
20% Severity
15% Population Impact
15% Infrastructure Gap
10% Vulnerability
10% Investment Gap
```

Formula:

```text
Priority Score =
0.30 × Citizen Demand
+ 0.20 × Severity
+ 0.15 × Population Impact
+ 0.15 × Infrastructure Gap
+ 0.10 × Vulnerability
+ 0.10 × Investment Gap
```

All components should be normalized to a common scale before aggregation.

The interface must expose the components.

The score is not an official government ranking.

---

# 25. Explainability

Every priority candidate should contain:

```text
WHY THIS PRIORITY?

• High concentration of citizen requests
• High severity share
• Large affected population estimate
• Low infrastructure coverage
• Significant demand-investment gap
```

Explainability must be tied to observable dataset fields.

Avoid generic AI prose such as:

> "This area is important because the AI believes it needs attention."

Instead show concrete signals.

---

# 26. Candidate Interventions

Candidate interventions are advisory.

Example:

```text
Drainage rehabilitation
Ward 12

Evidence:
- high drainage demand
- low drainage coverage
- repeated waterlogging reports
- investment gap signal

Status:
Candidate intervention — requires human review
```

There must be no UI that implies automatic government approval or assignment.

---

# 27. Government AI Assistant

The assistant should answer questions such as:

- Which areas have the highest drainage demand?
- Why is Ward 12 a priority?
- What are the largest infrastructure gaps?
- Compare citizen demand with investment.
- Which areas have the largest investment mismatch?
- What issues are increasing?

The assistant should use the application's structured dataset.

The demo assistant can use deterministic response logic.

Real Gemini integration can be added after the demo flow is stable.

---

# 28. Accessibility

The application already includes accessibility infrastructure and visible focus rings.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible form labels
- ARIA where needed
- live announcements for dynamic status
- map alternative list
- screen-reader-friendly status
- no color-only meaning
- reduced-motion support

The map must not be the only way to understand demand hotspots.

---

# 29. Visual Design

The existing design system uses a restrained institutional palette.

Primary:

```text
#1F4E79
```

Secondary:

```text
#2D7D6E
```

Background:

```text
#F6F7F9
```

Surface:

```text
#FFFFFF
```

Text:

```text
#16202B
```

The design should remain:

- institutional
- calm
- accessible
- evidence-oriented
- professional

Avoid:

- excessive gradients
- neon colors
- excessive glassmorphism
- unnecessary animation

---

# 30. Data Provenance

Every contextual dataset should have provenance.

Recommended provenance values:

```text
public
curated
synthetic
unavailable
```

Example:

```text
Population
Source: Synthetic
Status: Demo

Investment
Source: Simulated
Status: Requires verification
```

Missing data must be shown explicitly:

```text
Public investment data
Not available — requires verification
```

Never replace missing data with zero.

---

# 31. Error Handling

## Citizen errors

Examples:

- empty request
- microphone denied
- analysis unavailable
- invalid location

## AI errors

If Gemini fails:

```text
Real AI service unavailable.
Switch to Demo Mode.
```

## Data errors

Use explicit states:

```text
Data unavailable
Requires verification
```

## Map errors

Provide list-based access to the same regions.

---

# 32. Security

Never expose:

- Gemini API key
- service credentials
- private API credentials

Use:

```env
GEMINI_API_KEY=
```

The key must only exist on the server.

The production backend should add:

- strict input validation
- schema validation
- authentication if deployed
- rate limiting
- restricted CORS
- request logging without sensitive citizen content

---

# 33. Privacy Considerations

Citizen submissions may contain sensitive free-form information.

Production architecture should:

- minimize stored personal data
- avoid collecting unnecessary identity information
- provide a retention policy
- protect raw voice recordings
- avoid exposing citizen identity in aggregate dashboards
- separate citizen identity from analytical request data

The current hackathon dataset is synthetic.

---

# 34. API Architecture

The current real-AI API is:

```text
POST /api/ai/analyse
```

A future backend can expose:

```text
POST /api/requests
POST /api/requests/voice
GET  /api/requests/:id
GET  /api/hotspots
GET  /api/hotspots/:id
GET  /api/hotspots/:id/evidence
GET  /api/areas
GET  /api/context
GET  /api/investments
GET  /api/projects
POST /api/assistant/query
GET  /api/health
```

The demo can continue using local services.

---

# 35. Future Data Architecture

Production target:

```text
React Frontend
      ↓
API Gateway / Backend
      ↓
Civic Request Service
      ↓
AI Processing Service
      ↓
Geospatial Service
      ↓
Analytics / Priority Engine
      ↓
Database
      ↓
Government Dashboard
```

Potential production database:

- PostgreSQL + PostGIS, or
- MongoDB with geospatial indexes

The current MVP intentionally avoids unnecessary infrastructure.

---

# 36. Core Domain Entities

## CitizenRequest

```text
id
channel
text
language
wardId
category
severity
urgency
affectedPopulation
date
```

## ProcessedRequest

```text
requestId
normalizedText
translation
category
subcategory
severity
location
clusterId
confidence
```

## DemandCluster

```text
id
wardId
label
requestCount
categories
severityScore
confidence
```

## GeographicArea

```text
id
name
geometry
centroid
population
```

## InfrastructureProfile

```text
wardId
roadQuality
drainageCoverage
waterAccess
electricityAccess
internetAccess
hospitalDensity
schoolDensity
publicTransportAccess
```

## InvestmentRecord

```text
wardId
sector
allocatedBudget
activeProjects
completionPercentage
```

## PriorityProject

```text
wardId
wardName
title
category
score
demand
severity
populationImpact
infrastructureGap
vulnerability
investmentGap
affectedPopulation
evidence
confidence
limitations
```

---

# 37. Demo Data Requirements

The demo dataset should contain at least:

- 100 citizen requests
- 20 geographic regions
- 3 languages
- 5+ issue categories
- infrastructure indicators
- investment indicators
- clusters
- project recommendations
- temporal trend data

The current project meets the broad dataset target through synthetic Kolkata data.

---

# 38. BRICS Scalability

The architecture should support:

```text
India
Brazil
Russia
China
South Africa
```

The current demo can focus on:

```text
India → Kolkata
```

Future country model:

```text
Country
  ↓
Region / State / Province
  ↓
City
  ↓
District
  ↓
Ward / Local Area
```

Future language expansion can include additional BRICS languages without changing the core request model.

---

# 39. Recommended Antigravity Implementation Strategy

Antigravity should NOT rebuild the project from scratch.

Use this sequence:

```text
1. Inspect repository
2. Run existing app
3. Inspect browser UI
4. Build implementation plan
5. Preserve working components
6. Fix architecture inconsistencies
7. Upgrade citizen experience
8. Upgrade analysis pipeline
9. Upgrade hotspot intelligence
10. Upgrade government command center
11. Upgrade investment-gap analysis
12. Upgrade priority engine
13. Upgrade explainability
14. Upgrade AI assistant
15. Test every route
16. Run production build
17. Fix errors
18. Update README
```

---

# 40. Important Current-Repository Reconciliation

The documentation baseline contains an older Bengaluru-oriented architecture in parts of the original implementation plan and legacy hotspot components.

The current README and current government dashboard use Kolkata.

Therefore the implementation baseline should be:

```text
PRIMARY DEMO CITY = KOLKATA
```

The following must be checked:

1. Remove or replace Bengaluru defaults.
2. Ensure all maps center on Kolkata.
3. Ensure labels use Kolkata wards.
4. Ensure all sample requests refer to the Kolkata demo.
5. Ensure methodology documentation matches Kolkata.
6. Ensure the AI assistant references the current dataset.
7. Ensure no stale Bengaluru names remain in visible UI.

The old `/dashboard` route should continue redirecting to `/government` unless there is a strong reason to remove compatibility.

---

# 41. Recommended File Architecture

```text
frontend/
├── server/
│   └── index.mjs
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── evidence/
│   │   ├── primitives/
│   │   └── request/
│   │
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   │   ├── ai.ts
│   │   ├── api.ts
│   │   ├── civicData.ts
│   │   └── mockDataStore.ts
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   └── index.css
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

# 42. Testing Strategy

## Build

```bash
npm install
npm run build
```

## Development

```bash
npm run dev
```

## Real AI proxy

```bash
npm run server
```

## Browser tests

### Citizen

- Open `/submit`
- select Bengali
- submit waterlogging example
- verify analysis
- verify request ID
- verify cluster
- verify affected population

### Government

- open `/government`
- inspect overview
- click Ward 12
- inspect evidence
- inspect infrastructure gap
- inspect investment gap
- inspect project recommendation
- inspect requests
- use assistant

### Accessibility

- keyboard-only navigation
- focus visibility
- screen reader labels
- map alternative list
- modal/panel escape handling

### Responsive

Test at:

```text
1440px desktop
800px tablet
375px mobile
```

---

# 43. Hackathon Demo Script

## Scene 1 — Citizen

Open `/submit`.

Select Bengali.

Submit:

```text
আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।
```

## Scene 2 — AI analysis

Show:

```text
Language: Bengali
Category: Drainage + Roads
Severity: High
Urgency: High
Area: Ballygunge / Ward 12
```

## Scene 3 — Cluster

Show related requests.

```text
Community demand cluster
Multiple related reports
```

## Scene 4 — Government dashboard

Open `/government`.

Select Ward 12.

## Scene 5 — Context

Show:

```text
Citizen demand
Infrastructure gap
Investment gap
Affected population
```

## Scene 6 — Priority

Show the transparent six-factor model.

## Scene 7 — Explainability

Click:

```text
Why this priority?
```

## Scene 8 — Recommendation

Show candidate intervention:

```text
Drainage rehabilitation + road improvement
```

## Scene 9 — AI Assistant

Ask:

```text
Why is Ward 12 a priority?
```

The answer should refer to the dataset evidence.

---

# 44. Judge-Facing Differentiator

The project should be explained as:

> **CivicSignal AI converts multilingual citizen voice into geographically aggregated, explainable infrastructure intelligence by combining citizen demand with demographic, infrastructure and investment data.**

Avoid describing the project simply as:

> "An AI chatbot for citizen complaints."

The chatbot is only a supporting interface.

The core innovation is the intelligence pipeline.

---

# 45. Limitations

The current hackathon implementation uses synthetic/curated demo data.

Therefore:

- demographic values are not official statistics
- investment values are simulated
- infrastructure indicators are demo signals
- priority scores are analytical prototypes
- voice mode does not yet perform production speech-to-text
- real Gemini mode requires an API key
- geographic data should be replaced with verified administrative boundaries for production

These limitations should be visible in the application.

---

# 46. Future Enhancements

Potential next steps:

1. Verified government datasets
2. PostGIS geographic backend
3. Production speech-to-text
4. Embedding-based clustering
5. Additional BRICS languages
6. WhatsApp/messaging ingestion where authorized
7. Citizen identity and privacy layer
8. Project outcome tracking
9. Intervention simulation
10. Natural-language analytics over live datasets
11. Role-based government access
12. Audit logs
13. Real investment-plan integration
14. Real-time demand monitoring
15. Public transparency portal

---

# 47. Final Definition of Done

The project is ready for the hackathon demonstration when:

- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] landing page works
- [ ] citizen text flow works
- [ ] Bengali demo works
- [ ] Hindi demo works
- [ ] voice UI works
- [ ] microphone denial has a graceful fallback
- [ ] request analysis works in Demo Mode
- [ ] request status works
- [ ] clustering is visible
- [ ] government dashboard works
- [ ] Kolkata map works
- [ ] hotspot interaction works
- [ ] infrastructure gaps work
- [ ] investment gaps work
- [ ] priority model is visible
- [ ] evidence explanation works
- [ ] candidate interventions are labelled advisory
- [ ] citizen request table works
- [ ] AI assistant works in Demo Mode
- [ ] Real AI mode keeps API key server-side
- [ ] synthetic data is clearly labelled
- [ ] accessibility path works
- [ ] responsive design works
- [ ] README is updated
- [ ] no stale Bengaluru references remain in the active demo

---

# 48. Documentation Status

This master document consolidates the current project documentation and the current uploaded implementation into one implementation baseline.

It should be treated as the working specification for Antigravity and future development.

When implementation changes materially, update:

```text
PRD.md
FSD.md
TAD.md
Design.md
Implementation-Plan.txt
README.md
```

and keep this master document synchronized.
