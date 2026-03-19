# ADR-010: Zod Runtime Validation

**Status**: Accepted

**Date**: 2024-03-19

## Context

Following the SecurityDevSecOps skill requirements, we needed runtime validation for:
- User inputs (medication form data)
- External data (future API responses)
- Preventing invalid state mutations

## Decision

We use Zod v4 for schema-based runtime validation.

### Validation Schemas Created

| Schema | Purpose |
|--------|---------|
| `medicationSchema` | Medication form validation |
| `taskSchema` | Task creation/updates |
| `medicationLogSchema` | Medication log entries |
| `frequencyEnum` | Frequency options |

### Validation Utilities

```typescript
validate(schema, data)      // Returns { success, data?, errors? }
safeValidate(schema, data)  // Type-safe version, throws on success
```

## Consequences

### Positive
- Runtime type safety beyond TypeScript
- Clear error messages for users
- Prevents invalid state mutations
- Self-documenting schemas
- 100% test coverage achieved

### Negative
- Additional bundle size (Zod ~15KB)
- Requires integration with forms

## Implementation

### File Structure

```
src/validation/
├── index.ts         # Validation utilities
├── index.test.ts    # Tests
└── schemas.ts       # Zod schemas
```

### Usage Example

```typescript
import { validate, safeValidate } from '@/validation';
import { medicationSchema } from '@/validation/schemas';

// Form submission
const result = validate(medicationSchema, formData);
if (!result.success) {
  showErrors(result.errors);
}

// Type-safe validation
const { data } = safeValidate(medicationSchema, formData);
```
