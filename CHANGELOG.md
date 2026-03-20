# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2024-03-19

### Fixed
- **Voice Enable Button**: Added explicit "Enable Voice Assistant" button to handle browser autoplay restrictions
- **CSP Fix**: Added worker-src and Sentry endpoints to CSP policy

### Known Issues
- Voice requires manual enabling due to browser autoplay policies

## [0.3.0] - 2024-03-19

### Added (Quality Infrastructure)
- **CSP Security**: vite-plugin-csp-guard for Content Security Policy headers
- **Zod Validation**: Runtime validation with Zod v4 schemas
- **Sentry Monitoring**: Browser error tracking and session replay
- **Vitest Testing**: 30 tests, 100% CORE coverage
- **Husky Git Hooks**: Pre-commit and pre-push

## [0.2.0] - 2024-03-18

### Changed
- **Design System Overhaul**: Professional minimalist redesign

## [0.1.0] - 2024-03-16

### Added
- Dashboard, Caregiver Dashboard, Emergency Button
- Hydration Tracker, Medication Tracker
- Voice Assistant, Persistent Storage

[Unreleased]: https://github.com/elecodes/golden-years-assistant/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.3.1
[0.3.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.3.0
[0.2.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.2.0
[0.1.0]: https://github.com/elecodes/golden-years-assistant/releases/tag/v0.1.0
