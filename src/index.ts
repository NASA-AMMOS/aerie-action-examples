// import {ActionParameterDefinitions, ActionParameters, ActionSettingDefinitions, ActionSettings, ActionValueSchema} from "./schema.js";
import type { ActionsAPI, ActionParameterDefinitions, ActionSettingDefinitions, ActionParameters, ActionSettings } from "aerie-actions";

// Define schemas for your action's settings and parameters
export const parameterDefinitions = {
  urlPath: { type: "string" },
  myBool: { type: "boolean" },
} satisfies ActionParameterDefinitions;

export const settingDefinitions = {
  externalUrl: { type: "string" },
  retries: { type: "int" },
} satisfies ActionSettingDefinitions;

// generate the correct typescript types from the schemas
type MyActionParameters = ActionParameters<typeof parameterDefinitions>;
type MyActionSettings = ActionSettings<typeof settingDefinitions>;

export async function main(parameters: MyActionParameters, settings: MyActionSettings, actionsAPI: ActionsAPI) {
  const url = `${settings.externalUrl}/${parameters.urlPath}`;

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
  const files = await actionsAPI.listSequences();
  console.log(`sequence files: ${JSON.stringify(files)}`);
  const myFile = await actionsAPI.readSequence("my_file");
  console.log(`myFile: ${JSON.stringify(myFile)}`);

  //
  const jsonStr = JSON.stringify(resultData, null, 2);
  const writeResult = await actionsAPI.writeSequence("action-template-output", jsonStr);
  console.log(`writeResult: ${JSON.stringify(writeResult)}`);

  return {
    status: "SUCCESS",
    data: resultData,
  };
}
