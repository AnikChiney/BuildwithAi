# CivicSignal AI

**Turning citizen voice into evidence for better public infrastructure.**

CivicSignal AI is a production-quality hackathon prototype for **AI for Digital Public Infrastructure & Governance**. It turns multilingual citizen development requests into structured demand signals, geographic clusters, infrastructure-gap analysis, demand-vs-investment comparisons and explainable project recommendations.

## Product flow

Citizen voice → multilingual AI understanding → structured development demand → geographic clustering → demand hotspots → data fusion → infrastructure gap analysis → demand vs investment → transparent priority model → explainable recommendations → government command center.

## Experiences

- **Citizen Portal** — `/submit`
  - Text or demo voice intake
  - English, Bengali and Hindi
  - Simulated location selection
  - Request analysis and transparency journey
- **Government Command Center** — `/government`
  - Overview
  - Demand hotspot map
  - Infrastructure gaps
  - Demand vs investment
  - Priority project candidates
  - Structured citizen requests
  - Dataset-grounded AI assistant

## Demo data

The demo contains **128 synthetic citizen requests across 20 Kolkata wards**, multiple languages, infrastructure indicators, simulated investment records, demand clusters and calculated project recommendations.

The interface explicitly labels simulated data. It must not be presented as official government statistics.

## Priority model

The prototype exposes the analytical factors:

- 30% Citizen Demand
- 20% Severity
- 15% Population Impact
- 15% Infrastructure Gap
- 10% Vulnerability
- 10% Investment Gap

The score is an analytical prototype, not an official government decision.

## AI modes

### Demo mode

Default. No API key is required. Deterministic analysis is used so the full flow works offline.

```env
VITE_AI_MODE=demo
```

### Real AI mode

The frontend calls a local backend proxy. The Gemini API key stays server-side.

```env
VITE_AI_MODE=real
VITE_AI_API_URL=http://localhost:8787
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Start the optional AI proxy separately:

```bash
npm run server
```

Never place `GEMINI_API_KEY` in frontend code or commit it.

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

For a production build:

```bash
npm run build
```

## Architecture

```text
frontend/
  src/
    data/demoData.ts       # centralized simulated dataset
    types/civic.ts         # civic intelligence domain types
    services/civicData.ts  # deterministic data/analysis layer
    services/ai.ts         # demo/real AI abstraction
    pages/
      LandingPage.tsx
      CitizenRequestPage.tsx
      SubmissionStatusPage.tsx
      GovernmentPage.tsx
      MethodPage.tsx
    components/            # reusable legacy components retained where useful
  server/index.mjs         # optional Gemini proxy
```

The React + TypeScript + Vite architecture is retained. Leaflet is used for geographic visualization and Recharts for analytics.

## Demo story

1. Open `/submit`.
2. Select Bengali.
3. Submit the supplied waterlogging/road message.
4. Review the AI analysis and cluster relationship.
5. Open the Government Command Center.
6. Inspect Ward 12 / Ballygunge.
7. Review demand, infrastructure gap, investment gap and the transparent priority factors.
8. Open Priority Projects and inspect the "Why this priority?" evidence.
9. Ask the Government AI Assistant a dataset question.

## Limitations

- Demo geography, demographic values, infrastructure indicators and investment records are simulated.
- Real government data integrations are not included.
- The optional Gemini proxy requires a valid API key and internet access.
- The demo voice mode intentionally simulates recording rather than sending audio to a speech service.
- Priority recommendations are decision-support artifacts and require human review.

## Future BRICS scalability

The domain model is country/city extensible. The command center already exposes a country/city selector for India, Brazil, Russia, China and South Africa while keeping Kolkata as the populated demo city. Additional BRICS languages, geographies, verified public datasets and institutional APIs can replace the demo data layer without changing the core UI flow.
