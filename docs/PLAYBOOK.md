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

# Run tests
npm run test

# Run tests in CI mode
npm run test:ci

# Run tests with coverage
npm run test:coverage
```

### Before Committing

Pre-commit hooks run automatically (tests, lint, build). If hooks fail:
1. Check test failures: `npm run test`
2. Check lint errors: `npm run lint`
3. Check build: `npm run build`

### Adding New Features

1. Create ADR for significant decisions (see `docs/adr/template.md`)
2. Follow accessibility checklist:
   - [ ] 60px minimum touch targets
   - [ ] ARIA labels on interactive elements
   - [ ] Focus states visible
   - [ ] Voice feedback for actions
3. Write validation schema if input is involved (Zod)
4. Write tests for CORE layer (store/utils/validation) - target 100% coverage
5. Update CHANGELOG.md

## Feature Flags

### Medication Reminders (v0.4.0)
- Enable: Set `VITE_REMINDERS_ENABLED=true` in `.env`
- Features: RemindersDashboard, AddMedication, MedicationHistory
- Notification: Web Notifications API with Service Worker

## Testing

### Test Infrastructure

- **Framework**: Vitest
- **Environment**: happy-dom
- **Library**: @testing-library/react + @testing-library/jest-dom

### Coverage Strategy (100/80/0)

| Layer | Coverage Target | Examples |
|-------|-----------------|----------|
| CORE | 100% | src/utils/, src/store/, src/validation/ |
| GLOBAL | 80% | src/pages/, src/components/ |
| INFRA | 0% | configs, monitoring, static files |

### Writing Tests

```bash
# Test file naming: *.test.ts or *.spec.ts
src/utils/voice.test.ts
src/store/useStore.test.ts
src/validation/index.test.ts
```

### Git Hooks (Husky)

| Hook | Trigger | Action |
|------|---------|--------|
| pre-commit | Every commit | Run tests, lint, build |
| pre-push | Every push | Verify 80% coverage threshold |

**Mac Compatibility**: All hooks are executable (`chmod +x`)

## Security

### Content Security Policy (CSP)

CSP headers are injected at build time via vite-plugin-csp-guard.

Key directives:
- `script-src`: `'self'`, `'unsafe-inline'`, `'unsafe-eval'`
- `style-src`: `'self'`, Google Fonts
- `frame-src`: `'none'` (prevents clickjacking)

### Runtime Validation (Zod)

Validate all user inputs with Zod schemas:

```typescript
import { validate } from '@/validation';
import { medicationSchema } from '@/validation/schemas';

const result = validate(medicationSchema, formData);
if (!result.success) {
  showErrors(result.errors);
```

### Security Audit

Run periodic security audits using the `security-review` skill:

```bash
# Activate skill and run audit
skill(name: "security-review")
```

The skill performs OWASP Top 10 analysis and provides file + line locations for all findings.

### Error Monitoring (Sentry)

Sentry captures errors automatically. Configure via `.env`:

```bash
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_APP_ENV=production
```

Manual error capture:

```typescript
import { captureError } from '@/monitoring/sentry';

try {
  riskyOperation();
} catch (error) {
  captureError(error, { context: 'user action' });
}
```

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
- [ ] Sentry DSN configured
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

### Testing Issues

1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Check coverage: `npm run test:coverage`

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
