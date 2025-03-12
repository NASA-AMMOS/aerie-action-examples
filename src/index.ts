import {ActionParameterDefinitions, ActionParameters, ActionSettingDefinitions, ActionSettings, ActionValueSchema} from "./schema.js";
import {Actions} from "aerie-actions/dist/helpers.js";

// Define schemas for your action's settings and parameters
export const paramDefs = {
  sequenceId: { type: "string" },
  myBool: { type: "boolean" }
} satisfies ActionParameterDefinitions;

export const settingDefs = {
  externalUrl: {type: "string"},
  retries: {type: "int"}
} satisfies ActionSettingDefinitions;

// generate the correct typescript types from the schemas
type MyActionParameters = ActionParameters<typeof paramDefs>;
type MyActionSettings = ActionSettings<typeof settingDefs>;


export async function main(actionParameters: MyActionParameters, actionSettings: MyActionSettings, ActionAPI: Actions) {
  const url = `${actionSettings.externalUrl}/${actionParameters.sequenceId}`;

  const startTime = performance.now();

  // Make a request to an external URL using fetch
  const result = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(`request took ${performance.now() - startTime}ms`);

  // try parsing result as either json or text
  let resultData: string;
  try {
    resultData = await result.clone().json();
  } catch {
    resultData = await result.clone().text();
  }

  // read/write files using the actions helpers
  const files = await ActionAPI.listSequences();
  const myFile = await ActionAPI.readSequence("my_file");
  console.log(`myFile: ${JSON.stringify(myFile)}`);

  const writeResult = await ActionAPI.writeSequence("new_file", "new contents");
  console.log(`writeResult: ${JSON.stringify(writeResult)}`);

  console.log('sequence files:', JSON.stringify(files));

  return {
    status: "SUCCESS",
    data: resultData,
  };
}
