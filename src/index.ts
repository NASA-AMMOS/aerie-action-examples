import { ActionParameters } from './models/action-parameters.js';
import { ActionSettings } from './models/action-settings.js';
// import { ActionMain } from 'aerie-action/src/models/main.ts';

export async function main(actionParameters: ActionParameters, actionSettings: ActionSettings) {
  // Make a dummy request.
  const result = await fetch(`${actionSettings.externalUrl}/${actionParameters.sequenceId}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const resultText = await result.text();

  return {
    status: "SUCCESS",
    data: resultText
  };
}
