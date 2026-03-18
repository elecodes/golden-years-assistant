# Technical Decisions Summary

Quick reference for key architectural decisions.

## Stack Decisions

| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | React 19 | Modern features, large ecosystem |
| Language | TypeScript | Type safety for healthcare code |
| Build | Vite | Fast builds, small bundles |
| State | Zustand + Persist | Simple, persistent localStorage |
| Styling | Tailwind CSS 4 | Rapid development, accessibility utilities |

## Design Decisions

| Category | Choice | Rationale |
|----------|--------|-----------|
| Accessibility | WCAG AAA target | Elderly user base |
| Touch targets | 70px minimum | Motor impairment support |
| Font size | 20px base | Readability for elderly |
| Color scheme | High contrast blue | Accessibility compliance |
| Voice | Web Speech API | Alternative interaction mode |

## Future Considerations

- [ ] PWA support for offline functionality
- [ ] Push notifications for medication reminders
- [ ] Voice recognition for hands-free operation
- [ ] Cloud sync for multi-device access
- [ ] Emergency contact integration (SMS/call APIs)

## Related Documentation

- Full ADRs: [docs/adr/](adr/)
- Engineering Standards: [docs/standards/](standards/)
