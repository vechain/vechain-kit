# next-chakra-v3

Minimal repro of b3tr's frontend stack for debugging vechain-kit theming and
color-mode propagation **without publishing new kit versions**.

What this mirrors from b3tr:

- Next.js (App Router) + React 18 — the monorepo's root `resolutions`
  field pins `next` to 15.5.9, so this example uses 15.5.9 instead of
  b3tr's 16.2.x. The bug we're chasing is in the kit / Chakra-v3 host
  interaction, not in Next itself, so this doesn't affect reproducibility.
- Chakra UI v3 with `cssVarsPrefix: "vbd"` and semantic tokens that have
  `_dark` variants
- next-themes (`attribute="class"`) driving the color mode
- A `useColorMode` wrapper that reads `resolvedTheme` from `useTheme()`
- A `VechainKitProviderWrapper` that pipes `useToken('colors', [...])`
  results — which Chakra v3 returns as CSS variable references like
  `var(--vbd-colors-bg-primary)` — straight into the kit's `theme` prop and
  passes `darkMode={colorMode === 'dark'}`

The kit is workspace-linked (`workspace:*`), so any change in
`packages/vechain-kit/src` flows through after a `yarn watch` rebuild.

## Run

```bash
# from repo root
yarn install:all   # only the first time, or after pulling dep changes
yarn dev:next-chakra-v3
```

The example serves on http://localhost:3001. Click the sun/moon icon to
toggle `next-themes`; open the connect modal to inspect kit theme
propagation.
