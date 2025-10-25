import vm from "node:vm";
import {
    ActionsAPI,
    ActionParameterDefinitions,
    ActionParameters,
    ActionSettingDefinitions,
    ActionSettings,
} from "@nasa-jpl/aerie-actions";

// Define schemas for your action's settings and parameters
export const parameterDefinitions = {
} satisfies ActionParameterDefinitions;

export const settingDefinitions = {
} satisfies ActionSettingDefinitions;

// generate the correct typescript types from the schemas
type MyActionParameters = ActionParameters<typeof parameterDefinitions>;
type MyActionSettings = ActionSettings<typeof settingDefinitions>;

export function adaptationQuery(): string {
    return `
    select id, adaptation, name, created_at, owner, updated_at, updated_by
    from sequencing.sequence_adaptation
      where id = $1;
  `;
}

export async function loadAdaptation(actions: ActionsAPI) {
    // lookup workspace's parcel and get its sequence adaptation ID
    const parcel = await actions.readParcel();
    const adaptationId = parcel.sequence_adaptation_id;
    if(!Number.isFinite(adaptationId)) throw new Error(`Invalid adaptation id ${adaptationId} (parcel ${parcel.id})`);

    // load sequence adaptation from the DB (as string)
    const adaptationResult = await actions.dbClient.query(adaptationQuery(), [adaptationId]);
    if(!adaptationResult.rowCount || !adaptationResult.rows[0])
        throw new Error(`Could not find sequence adaptation with id ${adaptationId} (parcel ${parcel.id})`);
    const adaptationRow = adaptationResult.rows[0];
    const adaptationStr = (adaptationRow.adaptation || '') as string;
    if(!adaptationStr.length)
        throw new Error(`Could not find sequence adaptation with id ${adaptationId} (parcel ${parcel.id})`);

    // evaluate the adaptation code in a node VM context & return the result
    const vmContext = vm.createContext();
    let adaptation: any;
    try {
        // todo what happens to log messages from adaptation? need to attach console/other globals?
        adaptation = vm.runInContext(adaptationStr, vmContext, { displayErrors: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : JSON.stringify(err);
        throw new Error(
            `failed to execute adaptation ${adaptationId} (parcel ${parcel.id}): ${message}`,
            { cause: err instanceof Error ? err : undefined }
        );
    }
    if (typeof adaptation !== 'object' || adaptation === null) {
        throw new TypeError(`Adaptation ${adaptationId} did not evaluate to an object: ${String(adaptation)}`);
    }
    return adaptation;
}

export async function main(actionParameters: MyActionParameters, settings: MyActionSettings, actions: ActionsAPI) {
    const parcel = await actions.readParcel();
    console.log("GOT PARCEL", parcel.sequence_adaptation_id);

    const parsedAdaptation = await loadAdaptation(actions);
    console.log(`loaded adaptation!`)
    // test translating from input format (seqN) to output format (seqJSON)
    const translated = parsedAdaptation.outputs[0].toOutputFormat(
        'C ECHO "HELLO"',
        {
            parameterDictionaries: [],
            commandDictionary: null,
            channelDictionary: null,
            librarySequences: []
        },
        "testName"
    );
    console.log('translated', translated);

    return {};
}
