import { main } from "../src/index";

// import assert from 'node:assert';
import { describe, it, test, mock } from "node:test";

const mockActionsAPI = {
  listSequences: async () => {},
  readSequence: async () => {
    console.log("called readSequence");
    return { definition: "test" };
  },
  writeSequence: async () => {},
};

test("aerie basic example action", async (t) => {
  await t.test("runs main", async () => {
    return await main({ urlPath: "repos/NASA-AMMOS/aerie" }, { externalUrl: "https://api.github.com" }, mockActionsAPI);
  });
});
