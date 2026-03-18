# GoldenYears Assistant - Playbook

Operational guide for developing, deploying, and maintaining the GoldenYears Assistant application.

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check and build
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
   - [ ] 60px minimum touch targets
   - [ ] ARIA labels on interactive elements
   - [ ] Focus states visible
   - [ ] Voice feedback for actions
3. Update CHANGELOG.md

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0F172A` | Headers, primary text |
| `--color-cta` | `#0369A1` | Primary buttons, links |
| `--color-success` | `#059669` | Success states, completed |
| `--color-warning` | `#D97706` | Warnings, low stock |
| `--color-emergency` | `#DC2626` | Emergency button |
| `--color-border` | `#E2E8F0` | Card borders |
| `--color-background` | `#F8FAFC` | Page background |

### Component Classes

```css
.card           /* Base card with border and shadow */
.card-interactive /* Interactive card with hover states */
.btn-primary    /* Sky blue CTA button */
.btn-secondary  /* Gray secondary button */
.btn-emergency  /* Red emergency button */
.btn-success    /* Emerald success button */
.badge          /* Base badge */
.badge-warning  /* Amber warning badge */
.badge-success  /* Emerald success badge */
.focus-ring     /* Visible focus indicator */
```

### Typography

- **Base font size**: 18px
- **Font weight**: Semibold for emphasis
- **Tracking**: Tight for headings

## Accessibility Standards

### Required for Every Component

```tsx
// Touch target (minimum 60px)
<button className="min-h-[60px]">

// Focus ring
<button className="focus-ring">

// ARIA label
<button aria-label="Description of action">

// Screen reader only text
<span className="sr-only">Hidden text</span>
```

### Color Contrast

| Element | Color | Ratio |
|---------|-------|-------|
| Primary text | `#0F172A` (slate-800) | 11.5:1 |
| Secondary text | `#475569` (slate-600) | 5.7:1 |
| CTA on white | `#0369A1` | 7.3:1 |

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
4. Restart dev server: `npm run dev`

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
- [ ] All buttons have 60px+ touch targets
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
- GitHub: [Repository](https://github.com/elecodes/golden-years-assistant)
