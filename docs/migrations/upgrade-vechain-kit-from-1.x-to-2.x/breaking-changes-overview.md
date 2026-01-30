# Breaking Changes Overview

This provides a high-level summary of all breaking changes in VeChain Kit v2. For detailed information on each topic, please refer to the specific guides linked below.

### Major Breaking Changes

#### 1. **Connex Removal**

* `useConnex` is completely removed and replaced with `useThor`
* This affects all blockchain interactions throughout your application
* [**See API Migration Guide →**](api-migration-guide.md#connex-to-thor)

#### 2. **New Contract Interaction Patterns**

* Introduction of `useCallClause` for reading contract data
* New `executeMultipleClausesCall` for batch operations
* Complete rewrite of transaction patterns
* [**See API Migration Guide →**](api-migration-guide.md#contract-interactions)

#### 3. **Updated Transaction Building**

* New `useBuildTransaction` hook with improved type safety
* Better error handling and transaction status tracking
* [**See API Migration Guide →**](api-migration-guide.md#transaction-building)

#### 4. **Module Removal**

* Entire VeBetterDAO module removed
* Several utility modules deprecated
* [**See Removed Features →**](removed-features-in-v2.md)

#### 5. **Hook Restructuring**

* Many hooks moved to new locations for better organization
* Import paths have changed significantly
* [**See Hook Relocations →**](/broken/pages/up5wuf323ff7ZRsHEeLM)

### Quick Decision Guide

### Next Steps

1. **Read the complete removal list** to check if you use any removed features
2. **Review the API migration patterns** for code examples
3. **Follow the migration checklist** step by step

### Getting Help

* **GitHub Issues**: [Report issues](https://github.com/vechain/vechain-kit/issues)
* **Documentation**: [VeChain Kit v2 Docs](https://docs.vechain.org/vechain-kit)
* **Community**: [Discord](https://discord.gg/vechain)
