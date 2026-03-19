# GoldenYears Assistant

A voice-enabled health and wellness assistant designed for elderly users, featuring medication tracking, hydration monitoring, daily task management, and emergency assistance.

## Features

- **Medication Tracking** - Track medications, dosages, and low-stock alerts
- **Hydration Monitoring** - Daily water intake tracker with visual progress
- **Daily Tasks** - Voice-assisted task management with completion tracking
- **Emergency Button** - One-tap access to emergency contacts with confirmation
- **Caregiver Dashboard** - Separate view for caregivers to manage care recipient data
- **Voice Assistant** - Text-to-speech for elderly-friendly interaction

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persist middleware
- **Icons**: Lucide React
- **Voice**: Web Speech API
- **Testing**: Vitest + Testing Library
- **Security**: vite-plugin-csp-guard (CSP headers)
- **Validation**: Zod v4 (runtime schema validation)
- **Monitoring**: Sentry (error tracking)
- **Quality Gates**: Husky git hooks

## Design System

Professional minimalist design with accessibility-first approach:

- **Colors**: Deep navy primary, sky blue CTA, emerald success states
- **Typography**: 18px base, semibold weights, tight tracking
- **Touch Targets**: 60px minimum for elderly-friendly interaction
- **Accessibility**: WCAG compliant, ARIA labels, focus states

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Preview production build
npm run preview

# Build for production
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
VITE_SENTRY_DSN=   # From sentry.io
VITE_APP_ENV=development
```

## Quality Assurance

### Test Coverage Strategy (100/80/0)

| Layer | Coverage Target | Examples |
|-------|-----------------|----------|
| CORE | 100% | src/utils/, src/store/, src/validation/ |
| GLOBAL | 80% | src/pages/, src/components/ |
| INFRA | 0% | configs, monitoring, static files |

### Git Hooks (Husky)

- **pre-commit**: Runs tests, lint, and build
- **pre-push**: Enforces 80% coverage threshold

### Security

- **CSP**: Content Security Policy headers via vite-plugin-csp-guard
- **Zod**: Runtime validation for all user inputs
- **Sentry**: Production error monitoring and session replay

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── EmergencyButton.tsx
│   ├── HydrationTracker.tsx
│   └── MedicationItem.tsx
├── pages/           # Main views
│   ├── Dashboard.tsx
│   └── CaregiverDashboard.tsx
├── store/           # Zustand state management
│   └── useStore.ts
├── utils/           # Utility functions
│   └── voice.ts    # Text-to-speech wrapper
├── validation/      # Zod schemas
│   ├── schemas.ts
│   └── index.ts
├── monitoring/     # Sentry integration
│   └── sentry.ts
├── test/           # Test setup and mocks
│   └── setup.ts
└── App.tsx         # Main app component
```

## Documentation

- [docs/adr/](docs/adr/) - Architecture Decision Records
- [docs/PLAYBOOK.md](docs/PLAYBOOK.md) - Development workflow and guidelines
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Version history
- [docs/decisions.md](docs/decisions.md) - Technical decisions summary

## Architecture Decisions

See [docs/adr/](docs/adr/) for architecture decision records:

| ADR | Title |
|-----|-------|
| ADR-001 | React + TypeScript + Vite Stack |
| ADR-002 | Zustand for State Management |
| ADR-003 | Tailwind CSS for Styling |
| ADR-004 | Accessibility-First Design |
| ADR-005 | Web Speech API Integration |
| ADR-006 | Professional Minimalist Design |
| ADR-007 | Vitest Testing Infrastructure |
| ADR-008 | Husky Git Hooks |
| ADR-009 | CSP Security Headers |
| ADR-010 | Zod Runtime Validation |
| ADR-011 | Sentry Error Monitoring |

## Skills & Standards

Project-specific engineering standards available in:
- [docs/standards/](docs/standards/) - Engineering standards skill bundle

## License

Private project - All rights reserved
