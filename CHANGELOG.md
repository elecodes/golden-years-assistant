# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2024-03-19

### Added (Quality Infrastructure)
- **CSP Security**: vite-plugin-csp-guard for Content Security Policy headers
- **Zod Validation**: Runtime validation with Zod v4 schemas
- **Sentry Monitoring**: Browser error tracking and session replay
- **ADR-009**: CSP security documentation
- **ADR-010**: Zod runtime validation documentation
- **ADR-011**: Sentry error monitoring documentation

### Testing Infrastructure
- **Vitest Testing**: Unit testing with Vitest, happy-dom, and Testing Library
- **Test Coverage**: 100% on CORE (store/utils/validation), 80% global threshold
- **Husky Git Hooks**: Pre-commit (tests, lint, build) and pre-push (coverage check)
- **ADR-007**: Vitest testing infrastructure documentation
- **ADR-008**: Husky git hooks documentation

## [0.2.0] - 2024-03-18

### Changed
- **Design System Overhaul**: Professional minimalist redesign
  - New color palette: Deep navy primary, sky blue CTA, emerald success
  - Cleaner card components with refined borders and shadows
  - Refined typography with semibold weights and tighter tracking
  - Emergency button refined for professional appearance
- Updated all components to new design system

## [0.1.0] - 2024-03-16

### Added
- **Dashboard Page**: Daily overview with tasks, hydration, and medications
- **Caregiver Dashboard**: Separate view for caregiver management
- **Emergency Button**: One-tap emergency assistance with confirmation flow
- **Hydration Tracker**: Visual water intake tracker with 8-glass daily goal
- **Medication Tracker**: Medication management with stock tracking and low-stock alerts
- **Voice Assistant**: Text-to-speech feedback for all user actions
- **Persistent Storage**: Zustand with localStorage persistence
- Engineering standards integration
- ADR documentation system
- Playbook documentation

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

[Unreleased]: https://github.com/elecodes/golden-years-assistant/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.3.0
[0.2.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.2.0
[0.1.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.1.0
