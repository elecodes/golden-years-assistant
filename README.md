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

## Design Principles

- WCAG AAA accessibility compliance
- Large touch targets (70px minimum) for elderly users
- High contrast color scheme
- Voice feedback for all interactions
- Responsive design (mobile-first)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
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

## Architecture Decisions

See [docs/adr/](docs/adr/) for architecture decision records.

## Skills & Standards

Project-specific engineering standards are available in:
- [docs/standards/](docs/standards/) - Engineering standards skill bundle

## License

Private project - All rights reserved
