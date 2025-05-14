# aerie-action-examples

[![Tests](https://github.com/NASA-AMMOS/aerie-action-examples/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/NASA-AMMOS/aerie-action-examples/actions/workflows/test.yml)

This repository contains runnable examples of [Aerie actions](https://nasa-ammos.github.io/aerie-docs/sequencing/actions/).  
Use them as references or starting points for building your own actions.

For more about actions and how they fit into the Aerie system, see the [Aerie docs](https://nasa-ammos.github.io/aerie-docs/sequencing/actions/).

## Prerequisites

[Node.js](https://nodejs.org/) is required to test and build the examples (version 22.x recommended, 18.x+ required). To verify your installation:

```bash
node --version
```

If you use [nvm](https://github.com/nvm-sh/nvm) to manage node versions, you can run `nvm use` to automatically use the correct version of Node.

## Structure

Each example action is an independent node.js package located under `examples/`, and typically includes:
* A `package.json` file defining the action's metadata and dependencies
* A `rollup.config.js` specifying how the action is bundled (usually unchanged)
* A `src` directory containing the source code of the action
* A `test` directory containing unit tests (optional)

## Usage

To use the examples in this repository:

1. Install dependencies for all examples, from the root of this project:

    ```bash
    npm install
    ```

2. Navigate to an example:

    ```bash
    cd examples/basic-action
    ```

3. Build the action:

    ```bash
    npm run build
    ```
    This generates a bundled file at `dist/action.js`, which you can [upload to Aerie](https://nasa-ammos.github.io/aerie-docs/sequencing/actions/).

4. Optionally, run unit tests for the example:

    ```bash
    npm run test
    ```

## Creating an action
For small experiments, you can modify example files directly, rebuild, and re-upload to Aerie to see the effects. When you are ready to create your own action, it is usually easiest to start from one of the examples:
1. Copy one of the example folders to a new location on your machine
2. Inside the new folder, reset the environment:

    ```bash
    rm -rf node_modules
    npm install
    npm run build
    ```

This will reinstall dependencies and verify that the action builds independently. At this point, you can begin making modifications or initialize a git repository to track your changes.

## Future work

This repository may be expanded over time with additional example actions demonstrating:

- More complex input and output types
- Best practices for validation, testing, and error handling
- Utils for writing action unit tests

Contributions are welcome!