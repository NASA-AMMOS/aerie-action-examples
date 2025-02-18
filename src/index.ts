import { ActionParameters } from './models/action-parameters.js';
import { ActionSettings } from './models/action-settings.js';
import { Main } from 'aerie-actions/main.js';

export const main: Main = async function (actionParameters: ActionParameters, actionSettings: ActionSettings) {
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
