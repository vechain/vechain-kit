# Examples Guide

## Purpose of Each Example

### next-template/ - **Optimized Best Practices** 🎯

**Purpose:** Demonstrate optimized VeChain Kit usage with minimal bundle size

**Configuration:**

-   ✅ Subpath imports (`@vechain/vechain-kit/hooks`, `/components`)
-   ✅ Conditional providers (only load what's used)
-   ✅ Minimal feature set (DAppKit only, or Privy only)
-   ✅ Bundle size optimized

**Target Bundle:** ~400KB (76% smaller than full setup)

**Use this when:**

-   Starting a new production app
-   Bundle size is critical
-   You want performance-first setup
-   You need specific features, not all

**Demonstrates:**

-   How to use subpath imports
-   How to configure minimal providers
-   How to achieve small bundles
-   Best practices for production apps

---

### homepage/ - **Full-Featured Showcase** 🌟

**Purpose:** Showcase ALL VeChain Kit features and capabilities

**Configuration:**

-   ✅ All providers enabled (Privy + DAppKit + Ecosystem)
-   ✅ All login methods available
-   ✅ All UI components used
-   ✅ Social logins, wallet connections, everything
-   ⚠️ Uses main barrel import (for backward compatibility demo)

**Target Bundle:** ~1.0MB (with all features + lazy modals)

**Use this when:**

-   Learning VeChain Kit features
-   Exploring all capabilities
-   Need comprehensive example
-   Building feature-rich app

**Demonstrates:**

-   Complete feature set
-   All login methods
-   Complex transaction flows
-   Multi-language support
-   All modal types
-   Social + wallet logins

---

### playground/ - **Backward Compatibility Test** 🔄

**Purpose:** Ensure legacy import patterns still work (regression testing)

**Configuration:**

-   ⚠️ Uses barrel imports from `@vechain/vechain-kit` (old style)
-   ✅ All features enabled
-   ✅ Tests backward compatibility
-   ✅ Should work identically to homepage

**Target Bundle:** ~1.0MB (same as homepage)

**Use this when:**

-   Testing backward compatibility
-   Verifying no breaking changes
-   Checking old import style works
-   Regression testing

**Demonstrates:**

-   Legacy import patterns work
-   Backward compatibility
-   No breaking changes
-   Upgrade path validation

---

### minimal-template/ - **Headless/Advanced** (To Be Created) ⚡

**Purpose:** Show absolute minimum bundle with custom UI

**Configuration:**

-   ✅ VeChainKitCoreProvider (minimal)
-   ✅ Headless mode (no Chakra UI)
-   ✅ Hooks only
-   ✅ Custom UI components
-   ✅ Maximum bundle optimization

**Target Bundle:** ~200KB (88% smaller than full setup)

**Use this when:**

-   Building custom UI
-   Using different component library
-   Need absolute minimum bundle
-   Advanced/power users

**Demonstrates:**

-   Core provider usage
-   Headless mode
-   Custom UI integration
-   Maximum optimization
-   Advanced patterns

---

## Bundle Size Progression (After Provider Optimization)

```
Current State (All examples: ~1.7MB)
├── next-template: 1.71 MB
├── homepage: 1.72 MB
└── playground: 1.72 MB

After Optimization
├── next-template: ~400KB  (↓ 76%)  ← Optimized
├── homepage: ~1.0MB       (↓ 40%)  ← Full-featured
├── playground: ~1.0MB     (↓ 40%)  ← Backward compat
└── minimal-template: ~200KB (↓ 88%) ← NEW: Headless
```

---

## When to Update Examples

### After Each Implementation Phase

**Phase 1 Complete (Quick Wins):**

-   [ ] Rebuild all examples
-   [ ] Measure new bundle sizes
-   [ ] Update READMEs with actual measurements
-   [ ] Verify all still work

**Phase 2 Complete (Conditional Providers):**

-   [ ] Update next-template with conditional config
-   [ ] Configure to only use needed providers
-   [ ] Measure impact on next-template
-   [ ] Update documentation

**Phase 3 Complete (Architecture):**

-   [ ] Create minimal-template example
-   [ ] Demonstrate core provider
-   [ ] Show headless mode
-   [ ] Document advanced patterns

**Phase 4 Complete (Final):**

-   [ ] Final bundle size measurements
-   [ ] Update all READMEs
-   [ ] Create comparison table
-   [ ] Add to main README

---

## Example Configuration Matrix

| Example          | Privy    | DAppKit | Ecosystem | Headless | Import Style | Target Bundle |
| ---------------- | -------- | ------- | --------- | -------- | ------------ | ------------- |
| next-template    | Optional | ✅      | ❌        | ❌       | Subpath      | 400KB         |
| homepage         | ✅       | ✅      | ✅        | ❌       | Barrel       | 1.0MB         |
| playground       | ✅       | ✅      | ✅        | ❌       | Barrel       | 1.0MB         |
| minimal-template | ❌       | ❌      | ❌        | ✅       | Subpath      | 200KB         |

---

## Testing Examples

### Build All Examples

```bash
# From repo root
yarn install:all

# Build all examples
yarn build

# Or individually
cd examples/next-template && yarn build
cd examples/homepage && yarn build
cd examples/playground && yarn build
```

### Verify Bundle Sizes

```bash
# Expected output after optimization:
# next-template: First Load JS shared by all: ~400KB
# homepage: First Load JS shared by all: ~1.0MB
# playground: First Load JS shared by all: ~1.0MB
```

### Check for Regressions

```bash
# Compare current branch with main
./scripts/compare-bundle-sizes.sh main feat/provider-optimization

# Should show reduction, not increase
```

---

## Maintenance Guidelines

### When Adding New Features

1. **Choose the right example:**

    - Core functionality → All examples
    - UI component → homepage + playground
    - Optimization technique → next-template
    - Advanced pattern → minimal-template

2. **Measure impact:**

    - Build before changes
    - Build after changes
    - Update bundle size in README if changed

3. **Keep examples aligned:**
    - next-template = optimized
    - homepage = comprehensive
    - playground = backward compat
    - minimal-template = advanced

### When Updating Dependencies

1. Build all examples
2. Measure bundle sizes
3. Update documentation if sizes change significantly
4. Run `./scripts/compare-bundle-sizes.sh` to verify impact

---

## Quick Reference

**Want smallest bundle?** → Start with `next-template`  
**Want to see all features?** → Check `homepage`  
**Upgrading from v1/v2?** → Follow `playground`  
**Building custom UI?** → See `minimal-template`

**Bundle size regression?** → Run `./scripts/compare-bundle-sizes.sh main your-branch`

---

_Keep this guide updated as examples evolve_
