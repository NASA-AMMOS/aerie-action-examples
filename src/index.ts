import { ActionParameters } from './models/action-parameters.js';
import { ActionSettings } from './models/action-settings.js';
import { Result } from './models/lib-types.js';

// TODO: How are the settings going to be provided to the action?
export async function main(actionParameters: ActionParameters, actionSettings: ActionSettings): Promise<Result> {
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
