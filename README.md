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
```

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
│   └── voice.ts     # Text-to-speech wrapper
└── App.tsx          # Main app component
```

## Documentation

- [docs/adr/](docs/adr/) - Architecture Decision Records
- [docs/PLAYBOOK.md](docs/PLAYBOOK.md) - Development workflow and guidelines
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Version history
- [docs/decisions.md](docs/decisions.md) - Technical decisions summary

## Architecture Decisions

See [docs/adr/](docs/adr/) for architecture decision records.

## Skills & Standards

Project-specific engineering standards available in:
- [docs/standards/](docs/standards/) - Engineering standards skill bundle

## License

Private project - All rights reserved
