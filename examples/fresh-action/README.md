# aerie-action-template

This is an example action that performs flight rule checking on a sequence.

## Usage

1. Install dependencies for the `fresh-action` with `npm install`.
2. Build the action by running `npm run build`. This generates a bundled file at `dist/action.js`, which you can [upload to Aerie](https://nasa-ammos.github.io/aerie-docs/sequencing/actions/).
3. Fresh requires a valid command dictionary to be [uploaded to Aerie](https://nasa-ammos.github.io/aerie-docs/command-expansion/upload-command-dictionary/) before it can be invoked.
4. Next is setting up a webserver than can execute fresh, this will require you getting a copy of the `mm-fresh` python dependency from [Cody Hansen](mailto:cody.m.hansen@jpl.nasa.gov).
5. After writing a sequence and generating valid SeqJSON Fresh is ready to be run, run the action that was created after `dist/action.js` was uploaded and provide the sequence name.
