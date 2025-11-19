# Button Usage Audit & Standardization Plan

## Executive Summary

This document audits all button usage across VeChain Kit and provides a standardization plan that maintains current visual appearance while enabling consistent theme customization.

## Current Button Variants

### Defined Variants (in `theme/button.ts`)
1. **`loginIn`** - Tertiary background, border, for non-VeChain login methods
2. **`loginWithVechain`** - Primary background, for VeChain login
3. **`vechainKitPrimary`** - Primary background, white text, 60px height
4. **`vechainKitSecondary`** - Secondary background, border, 60px height
5. **`vechainKitTertiary`** - Tertiary background, border, 60px height
6. **`vechainKitLogout`** - Error color background, for logout actions
7. **`mainContentButton`** - Secondary background, for quick actions
8. **`actionButton`** - Secondary background, for account modal actions

## Current Usage Patterns

### ✅ Correctly Using Variants

| Component | Variant | Context | Status |
|-----------|---------|---------|--------|
| SendTokenContent | `vechainKitPrimary` | Send button | ✅ Correct |
| TransactionModal | `vechainKitPrimary` | Confirm button | ✅ Correct |
| TransactionModal | `vechainKitSecondary` | Close button | ✅ Correct |
| LegalDocumentsContent | `vechainKitPrimary` | Accept button | ✅ Correct |
| CustomizationContent | `vechainKitPrimary` | Save Changes | ✅ Correct |
| ChooseNameContent | `vechainKitPrimary` | Choose name | ✅ Correct |

### ⚠️ Inconsistent Usage

| Component | Current | Issue | Should Be |
|-----------|--------|-------|-----------|
| EcosystemContent | Card colors (no variant) | Buttons don't use theme | `vechainKitTertiary` |
| ConnectionButton (login) | `loginIn` | Login-specific variant | `vechainKitTertiary` |
| ConnectionButton (VeChain) | `loginWithVechain` | Login-specific variant | `vechainKitPrimary` |
| QuickActionsSection | `mainContentButton` | Custom variant | `vechainKitSecondary` |
| ActionButton | `actionButton` | Custom variant | `vechainKitSecondary` |

### ❌ Missing Variants

| Component | Current | Issue |
|-----------|---------|-------|
| ProfileContent | No buttons directly | Uses ProfileCard (needs audit) |
| Some settings | No variant | Uses default Chakra styles |

## Standardization Rules

### Rule 1: Primary Actions
**Always use `vechainKitPrimary` for:**
- Main call-to-action buttons
- Confirmation buttons
- Submit/Save buttons
- Primary flow buttons (Send, Confirm, etc.)

### Rule 2: Secondary Actions  
**Always use `vechainKitSecondary` for:**
- Cancel/Close buttons
- Alternative actions
- Secondary CTAs
- Quick action buttons

### Rule 3: Selection/List Items
**Always use `vechainKitTertiary` for:**
- Login method buttons (non-VeChain)
- Ecosystem app selection
- Account selection
- List item buttons

### Rule 4: Special Cases
- **Logout/Disconnect:** `vechainKitLogout`
- **Icon-only buttons:** `ghost`
- **Link buttons:** `link` (use sparingly)

## Migration Strategy

### Phase 1: Visual Preservation (Current)
**Goal:** Ensure all variants produce visually consistent results

1. Update `loginIn` variant to match `vechainKitTertiary` visually
2. Update `loginWithVechain` variant to match `vechainKitPrimary` visually  
3. Ensure `mainContentButton` and `actionButton` match `vechainKitSecondary` visually

### Phase 2: Variant Consolidation (Non-Breaking)
**Goal:** Replace custom variants with standard variants

1. Replace `loginIn` → `vechainKitTertiary` (maintains visual)
2. Replace `loginWithVechain` → `vechainKitPrimary` (maintains visual)
3. Replace `mainContentButton` → `vechainKitSecondary` (maintains visual)
4. Replace `actionButton` → `vechainKitSecondary` (maintains visual)

### Phase 3: Fix Missing Variants
**Goal:** Add variants to buttons that don't have them

1. Update EcosystemContent buttons to use `vechainKitTertiary`
2. Audit ProfileCard buttons
3. Add variants to any buttons using card colors directly

## Implementation Plan

### Step 1: Update Button Theme (No Visual Change)
Update variants to ensure they're visually identical where they should be:

```typescript
// loginIn should visually match vechainKitTertiary
loginIn: {
  // Same as vechainKitTertiary but with different padding
  bg: tokens.colors.tertiary.base,
  // ... rest matches
}

// loginWithVechain should visually match vechainKitPrimary  
loginWithVechain: {
  // Same as vechainKitPrimary but with different padding
  bg: tokens.colors.primary.base,
  // ... rest matches
}
```

### Step 2: Create Alias Variants (Backward Compatible)
Keep old variants but make them aliases:

```typescript
// For backward compatibility during migration
loginIn: getVariants(tokens).vechainKitTertiary, // Alias
loginWithVechain: getVariants(tokens).vechainKitPrimary, // Alias
```

### Step 3: Update Components Incrementally
Update components one by one, testing visual consistency:

1. EcosystemContent buttons
2. ConnectionButton variants
3. QuickActionsSection
4. ActionButton

### Step 4: Documentation
Update developer docs with button usage guidelines.

## Testing Checklist

After standardization, verify:
- [ ] All primary actions use `vechainKitPrimary`
- [ ] All secondary actions use `vechainKitSecondary`
- [ ] All selection buttons use `vechainKitTertiary`
- [ ] Visual appearance unchanged from current state
- [ ] Theme customization works consistently
- [ ] All buttons respond to theme changes

## Next Steps

1. **Review this audit** - Confirm understanding of current state
2. **Approve migration plan** - Ensure it meets requirements
3. **Implement Phase 1** - Update theme to ensure visual consistency
4. **Test thoroughly** - Verify no visual regressions
5. **Implement Phase 2** - Consolidate variants
6. **Update documentation** - Add button usage guide for developers

