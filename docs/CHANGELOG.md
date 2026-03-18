# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Engineering standards integration (`docs/standards/`)
- ADR documentation system (`docs/adr/`)
- Playbook documentation (`docs/PLAYBOOK.md`)

### Changed
- README.md updated with project documentation

## [0.1.0] - 2024-03-18

### Added
- **Dashboard Page**: Daily overview with tasks, hydration, and medications
- **Caregiver Dashboard**: Separate view for caregiver management
- **Emergency Button**: One-tap emergency assistance with confirmation flow
- **Hydration Tracker**: Visual water intake tracker with 8-glass daily goal
- **Medication Tracker**: Medication management with stock tracking and low-stock alerts
- **Voice Assistant**: Text-to-speech feedback for all user actions
- **Persistent Storage**: Zustand with localStorage persistence

### Features
- Bottom navigation for switching between User and Caregiver views
- Task completion tracking with visual progress bar
- Medication logging (Taken, Missed, Skipped)
- Share code generation for caregiver pairing

### Accessibility
- 70px minimum touch targets for elderly users
- WCAG AAA color contrast compliance
- ARIA labels and roles throughout
- Focus states for keyboard navigation
- Voice confirmation for all interactions

### Technical
- React 19 + TypeScript
- Vite build system
- Tailwind CSS 4 with custom theme
- Zustand state management with persist middleware
- Lucide React icons

[Unreleased]: https://github.com/your-repo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-repo/releases/tag/v0.1.0
