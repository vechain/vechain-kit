# Button Standardization Guide

## Problem Statement

Currently, buttons across VeChain Kit use inconsistent variants and styling approaches:
- Some use button theme variants (`vechainKitPrimary`, `vechainKitSecondary`)
- Some use login-specific variants (`loginIn`, `loginWithVechain`)
- Some use card colors directly (no variant)
- Some use Chakra defaults (`ghost`, `outline`, `unstyled`)
- Same actions use different styles in different contexts

This makes theme customization difficult for developers.

## Button Variant Standards

### Primary Actions (`vechainKitPrimary`)
**Use for:** Main call-to-action buttons, confirmations, primary flows
- **Examples:**
  - "Confirm" in transaction modals
  - "Send" in send token flow
  - "Choose name" in name selection
  - "Accept" in legal documents
  - "Connect" (VeChain login button)

**Visual:** Uses `primary.base` background, white text, full width, 60px height

### Secondary Actions (`vechainKitSecondary`)
**Use for:** Secondary actions, cancel/close buttons, alternative options
- **Examples:**
  - "Close" buttons
  - "Cancel" buttons
  - "Try again" after errors
  - "For developers" link button
  - Quick action buttons in main content

**Visual:** Uses `secondary.base` background, `text.primary` color, border, full width, 60px height

### Tertiary Actions (`vechainKitTertiary`)
**Use for:** Less prominent actions, list items, selectable options
- **Examples:**
  - Login method buttons (email, social login)
  - Ecosystem app selection buttons
  - Account selection buttons

**Visual:** Uses `tertiary.base` background, `text.primary` color, border

### Login-Specific Variants
**`loginIn`** - For non-VeChain login methods (email, social, etc.)
**`loginWithVechain`** - For VeChain-specific login button

**Note:** These should eventually be replaced with `vechainKitTertiary` and `vechainKitPrimary` respectively for consistency.

### Special Variants
**`vechainKitLogout`** - For logout/disconnect actions (uses error color)
**`actionButton`** - For action buttons in account modal (uses secondary colors)
**`mainContentButton`** - For buttons in main content area (uses secondary colors)

### Utility Variants
**`ghost`** - For icon-only buttons, back buttons, close buttons without background
**`outline`** - For outlined buttons (use sparingly)
**`unstyled`** - For custom-styled buttons (avoid if possible)

## Current Issues & Migration Path

### Issue 1: Ecosystem Buttons Use Card Colors
**Current:** `EcosystemContent.tsx` buttons use `backgroundColor={buttonBg}` (card color)
**Should be:** `variant="vechainKitTertiary"` or `variant="loginIn"`

### Issue 2: Inconsistent Login Button Variants
**Current:** Mix of `loginIn`, `loginWithVechain`, card colors
**Should be:** Standardize to `vechainKitTertiary` for non-VeChain, `vechainKitPrimary` for VeChain

### Issue 3: Profile/Settings Buttons Missing Variants
**Current:** Some buttons have no variant, using default styles
**Should be:** Apply appropriate variant based on action type

### Issue 4: Same Action, Different Styles
**Current:** "Send" uses primary in some places, secondary in others
**Should be:** Primary actions always use `vechainKitPrimary`

## Migration Strategy

### Phase 1: Document Current State
- ✅ Create this standardization guide
- Map all button usages to their current variants
- Identify visual inconsistencies

### Phase 2: Standardize Without Visual Changes
- Update button variants to match standards
- Ensure visual appearance remains the same
- Update theme tokens if needed to maintain current look

### Phase 3: Refactor for Consistency
- Replace login-specific variants with standard variants
- Update ecosystem buttons to use button variants
- Ensure all buttons use theme tokens

## Button Usage Matrix

| Context | Current Variant | Recommended Variant | Notes |
|---------|----------------|-------------------|-------|
| Login - VeChain | `loginWithVechain` | `vechainKitPrimary` | Main login method |
| Login - Email/Social | `loginIn` | `vechainKitTertiary` | Alternative login |
| Login - Ecosystem | Card colors | `vechainKitTertiary` | Should use variant |
| Send Token | `vechainKitPrimary` | `vechainKitPrimary` | ✅ Correct |
| Confirm Transaction | `vechainKitPrimary` | `vechainKitPrimary` | ✅ Correct |
| Close/Cancel | `vechainKitSecondary` | `vechainKitSecondary` | ✅ Correct |
| Quick Actions | `mainContentButton` | `vechainKitSecondary` | Consider consolidating |
| Profile Actions | No variant | `vechainKitSecondary` | Needs variant |
| Settings Actions | `ghost` | `ghost` | ✅ Correct for icons |

## Next Steps

1. **Audit all buttons** - Complete mapping of all button usages
2. **Create visual reference** - Screenshots showing current vs standardized
3. **Update theme tokens** - Ensure variants produce desired visual results
4. **Refactor components** - Update buttons to use correct variants
5. **Update documentation** - Add button usage guidelines for developers

