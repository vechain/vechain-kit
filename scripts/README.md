# Scripts

## Bundle Size Comparison

### `compare-bundle-sizes.sh`

Compare the bundle sizes of the `@vechain/vechain-kit` package between two git branches.

#### Usage

**Important:** Run from the repository root (the script will auto-navigate there)

```bash
# From repository root
./scripts/compare-bundle-sizes.sh <base-branch> <compare-branch>

# Or from any directory (script finds git root)
cd scripts/
./compare-bundle-sizes.sh <base-branch> <compare-branch>
```

#### Examples

```bash
# From repository root
./scripts/compare-bundle-sizes.sh main $(git branch --show-current)

# From any subdirectory (script auto-navigates to root)
cd packages/vechain-kit
../../scripts/compare-bundle-sizes.sh main ralph/barrel-imports

# Compare two feature branches
./scripts/compare-bundle-sizes.sh feature/old feature/new

# Default: Compare main with current branch
./scripts/compare-bundle-sizes.sh
```

#### Output

The script will:
1. Build both branches
2. Calculate total bundle sizes
3. Generate a detailed markdown report: `bundle-size-comparison.md`
4. Show a summary in the terminal

#### What It Measures

- Total dist folder size
- Individual file sizes
- New files (added in compare branch)
- Removed files (removed from base branch)
- Modified files (size changes)
- Entry point analysis

#### Requirements

- Node.js (specified in `.nvmrc`)
- Yarn
- Git
- bc (for calculations, usually pre-installed)

#### Notes

- The script will temporarily checkout different branches
- It will return you to your original branch when complete
- Build artifacts are cleaned before each build
- Results are saved to `bundle-size-comparison.md` in the repo root

#### Example Output

```
VeChain Kit Bundle Size Comparison
══════════════════════════════════

Base branch:    main
Compare branch: ralph/barrel-imports
Results will be saved to: bundle-size-comparison.md

═══════════════════════════════════════════════════════
Summary
═══════════════════════════════════════════════════════

main:                           5.6M (5774947 bytes)
ralph/barrel-imports:            5.7M (5873957 bytes)
Difference:          +96.68KB (+1.71%)

✅ Comparison complete!
Detailed report saved to: bundle-size-comparison.md
```

#### Troubleshooting

**"du: invalid option"**
- The script auto-detects macOS vs Linux
- If issues persist, check that `stat` and `find` are available

**Build errors**
- Ensure the branches you're comparing can both build successfully
- Check that dependencies are installed

**Permission denied**
- Make the script executable: `chmod +x scripts/compare-bundle-sizes.sh`
