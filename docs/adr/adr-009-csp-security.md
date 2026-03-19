# ADR-009: Content Security Policy (CSP) via vite-plugin-csp-guard

**Status**: Accepted

**Date**: 2024-03-19

## Context

Following the SecurityDevSecOps skill requirements, we needed to implement security headers including Content-Security-Policy (CSP) to protect against XSS and injection attacks. Since this is a React SPA (no backend), we use a Vite plugin for CSP injection.

## Decision

We use `vite-plugin-csp-guard` to inject CSP meta tags into the HTML at build time.

### CSP Policy Applied

| Directive | Value | Purpose |
|----------|-------|---------|
| `default-src` | `'self'` | Default fallback |
| `script-src` | `'self'`, `'unsafe-inline'`, `'unsafe-eval'` | React requires inline/eval for HMR |
| `style-src` | `'self'`, `'unsafe-inline'`, Google Fonts | Tailwind + Google Fonts |
| `font-src` | `'self'`, Google Fonts | Google Fonts CDN |
| `img-src` | `'self'`, `data:`, `blob:` | Images and data URIs |
| `connect-src` | `'self'` | Future API calls |
| `frame-src` | `'none'` | Prevent iframe embedding |
| `object-src` | `'none'` | No Flash/plugin content |
| `base-uri` | `'self'` | Prevent base tag injection |
| `form-action` | `'self'` | Forms only submit to self |

## Consequences

### Positive
- Protection against XSS attacks
- Prevents clickjacking (no frames)
- Blocks unauthorized resource loading
- Built into build output automatically

### Negative
- `unsafe-inline` required for React (limitation)
- Requires maintenance when adding new CDNs

## Alternatives Considered

### Helmet (Express)
- Not applicable - this is a SPA without Express backend
- Would require adding a backend server

### Manual Meta Tags
- Error-prone
- No automatic hash calculation
- Harder to maintain
