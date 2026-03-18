# GoldenYears Assistant - Playbook

Operational guide for developing, deploying, and maintaining the GoldenYears Assistant application.

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Type check
npm run build
```

### Before Committing

1. Run `npm run lint` - Fix any errors
2. Run `npm run build` - Ensure production build succeeds
3. Test accessibility - Verify touch targets, contrast, keyboard nav
4. Test voice feedback - Confirm audio works on interactions

### Adding New Features

1. Create ADR for significant decisions (see `docs/adr/template.md`)
2. Follow accessibility checklist:
   - [ ] 70px minimum touch targets
   - [ ] ARIA labels on interactive elements
   - [ ] Focus states visible
   - [ ] Voice feedback for actions
3. Update CHANGELOG.md

## Accessibility Standards

### Required for Every Component

```tsx
// Touch target
<button className="min-h-[70px] min-w-[70px]">

// Focus ring
<button className="focus-ring">

// ARIA label
<button aria-label="Description of action">

// Screen reader only text
<span className="sr-only">Hidden text</span>
```

### Color Contrast

- Primary text: `#1E293B` (slate-900) - 11.5:1 ratio
- Secondary text: `#475569` (slate-600) - 5.7:1 ratio
- Primary blue: `#1E3A8A` on white - 8.59:1 ratio

## Deployment

### Build for Production

```bash
npm run build
# Output in dist/
```

### Preview Production Build

```bash
npm run preview
```

### Deploy Checklist

- [ ] All tests pass
- [ ] Lighthouse accessibility score > 95
- [ ] Production build succeeds
- [ ] CHANGELOG.md updated

## Troubleshooting

### App Not Rendering

1. Check browser console for errors (F12)
2. Verify npm dependencies installed: `npm install`
3. Clear browser cache: Cmd+Shift+R
4. Restart dev server

### Voice Not Working

1. Check browser supports Web Speech API
2. Ensure browser audio not muted
3. Check for blocking permissions

### State Not Persisting

1. Check localStorage available
2. Verify storage quota not exceeded
3. Check browser privacy settings

## Testing Checklist

### Manual Testing

- [ ] Emergency button flow works
- [ ] All buttons have 70px+ touch targets
- [ ] Voice announces actions
- [ ] Navigation works on mobile
- [ ] Progress bars animate correctly
- [ ] Medication low-stock alerts appear

### Browser Testing

- [ ] Chrome latest
- [ ] Safari latest
- [ ] Firefox latest
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Resources

- Engineering Standards: `docs/standards/SKILLS.md`
- ADRs: `docs/adr/`
- GitHub: [Repository](https://github.com/your-repo)
