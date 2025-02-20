import { ActionParameters } from './models/action-parameters.js';
import { ActionSettings } from './models/action-settings.js';
// import { ActionMain } from 'aerie-action/src/models/main.ts';

import {listFiles, readFile, writeFile} from 'aerie-actions/dist/helpers.js';

export async function main(actionParameters: ActionParameters, actionSettings: ActionSettings) {
  const url = `${actionSettings.externalUrl}/${actionParameters.sequenceId}`;
  const startTime = performance.now();

  // Make a request to an external URL using fetch
  const result = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
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
  const files = listFiles();
  const myFile = readFile('my_file');
  writeFile('new_file', 'new contents');

  return {
    status: "SUCCESS",
    data: resultData
  };
}
