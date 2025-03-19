// import { test } from 'node:test';
// import assert from 'node:assert';
import { describe, it, test, mock } from "node:test";
import assert from "assert";
import { Actions } from "aerie-actions/dist/helpers.js";

import { main } from "../src/index";

const mockActionsAPI = {
  listSequences: async () => {},
  readSequence: async () => {
    console.log("got mocked");
    return { definition: "test" };
  },
  writeSequence: async () => {},
};

test("aerie figlet action", async (t) => {
  await t.test("runs main", async () => {
    return await main(
      {
        inputFile: "figlet-input",
        font: "roman",
      },
      {},
      mockActionsAPI,
    );
  });
});
