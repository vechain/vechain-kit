#### VeChain Kit E2E Tests

## Pre-conditions

In order to run the tests, you'll need to deploy a simple app that uses vechain kit and run thor-solo network. Here how to do it all:

1. Install all dependencies:
```bash
# project root
yarn install
```

2. Run thor-solo. If you already have an instance of thor-solo running - skip this step
```bash
# ./thor-solo
make solo-up
```

3. Build vechain-kit package:
```bash
# ./packages/vechain-kit
yarn build
```

4. Build and start next-template example app:
```bash
# ./examples/next-template
yarn build
yarn dev
```

5. Install playwright browsers
```bash
# ./tests/e2e
yarn install-browsers
```

## Running the tests

There are a couple options available. By default, tests are running in a headless state:

```sh
yarn test
```

You can also run them in headed state in case you want to see the tests execution:

```sh
yarn test:headed
```

And there's a debug option. It will run tests in a serial manner, allowing to execute every test "step-by-step" giving enough time to inspect all the stuff needed in-between steps execution.

```sh
yarn test:debug
```

## Reporting

After tests are complete, run this command. It will generate and open a report in your default browser. 
```sh
yarn report
```