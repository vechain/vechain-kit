# Peer Dependencies

Ensure that your project's peer dependencies align with VeChain Kit's specifications. Mismatched versions can cause installation failures, runtime errors, or unexpected behaviour.

### Common Issues

* Package installation fails with peer dependency warnings
* Runtime errors about missing dependencies
* Version conflicts between VeChain Kit and your existing packages

### Solution

1. #### Clean Installation

Often resolves dependency caching issues:

```bash
# Remove existing installations
rm -rf node_modules
rm package-lock.json # or yarn.lock

# Reinstall packages
npm install # or yarn install
```



2. #### Check Required Peer Dependencies

VeChain Kit requires specific versions of:

* **Chakra UI React**: `^2.8.2`
* **TanStack React Query**: `^5.64.2`
* **VeChain DApp Kit React**: `2.0.1`



3. **Update or Downgrade Packages**

You may need to adjust package versions to maintain compatibility:

```bash
# Check what VeChain Kit expects
npm info @vechain/vechain-kit peerDependencies

# Install required peer dependencies
npm install @chakra-ui/react@^2.8.2 @tanstack/react-query@^5.64.2 @vechain/dapp-kit-react@2.0.1
```

