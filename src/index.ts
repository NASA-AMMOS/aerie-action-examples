import { ActionParameters } from './models/action-parameters.js';
import { ActionSettings } from './models/action-settings.js';
// import { ActionMain } from 'aerie-action/src/models/main.ts';

export const main = async function (actionParameters: ActionParameters, actionSettings: ActionSettings) {
  // Make a dummy request.
  await fetch(`${actionSettings.externalUrl}/${actionParameters.sequenceId}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return {
    message: `This is a test message. Supplied parameters: ${actionParameters}`
  }
}
