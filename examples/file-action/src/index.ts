import type {
  ActionsAPI,
  ActionParameterDefinitions,
  ActionSettingDefinitions,
  ActionParameters,
  ActionSettings,
} from "@nasa-jpl/aerie-actions";

// Define schemas for your action's settings and parameters
export const parameterDefinitions = {
} satisfies ActionParameterDefinitions;

export const settingDefinitions = {
  copyFile: { type: "boolean" },
  copyFilePath: { type: "string" },
  copyFileDest: { type: "string" },
  readFile: { type: "boolean" },
  readFilePath: { type: "string" },
  readDirectory: { type: "boolean" },
  readDirectoryPath: { type: "string" },
  writeFile: { type: "boolean" },
  writeFilePath: { type: "string" },
  writeFileContents: { type: "string" },
  writeFileOverwrite: { type: "boolean" },
  writeDirectory: { type: "boolean" },
  writeDirectoryPath: { type: "string" },
  writeDirectoryOverwrite: { type: "boolean" },
  moveFile: { type: "boolean" },
  moveFilePath: { type: "string" },
  moveFileDest: { type: "string" },
  deleteFile: { type: "boolean" },
  deleteFilePath: { type: "string" },
} satisfies ActionSettingDefinitions;

// generate the correct typescript types from the schemas
type MyActionParameters = ActionParameters<typeof parameterDefinitions>;
type MyActionSettings = ActionSettings<typeof settingDefinitions>;

export async function main(parameters: MyActionParameters, settings: MyActionSettings, actionsAPI: ActionsAPI) {

  // note: only wrap in try/catch to handle *non-fatal errors*! Fatal errors should be thrown to properly report action run as failure

  // read/write files using the actions helpers
  if (settings.readDirectory) {
    try {
      const files = await actionsAPI.listFiles(settings.readDirectoryPath);
      console.log(`Contents of directory: ${JSON.stringify(files)}`);
      return {
        status: "SUCCESS",
        data: `Contents of directory: ${JSON.stringify(files)}`,
      };
    } catch (e) {
      console.error("Outer error caught:", e);
      return {
        status: "ERROR",
        data: `Could not read directory ${settings.readDirectoryPath}`,
      };
    }
  }

  if (settings.readFile) {
    try {
      const myFile = await actionsAPI.readFile(settings.readFilePath);
      console.log(`${settings.readFilePath}: ${JSON.stringify(myFile)}`);
      return {
        status: "SUCCESS",
        data: `File ${settings.readFilePath} contents: ${JSON.stringify(myFile)}`,
      };
    } catch (e) {
      console.warn(`Could not find file named ${settings.readFilePath}`);
      return {
        status: "ERROR",
        data: `Could not read file ${settings.readFilePath}`,
      };
    }
  }

  if (settings.copyFile) {
    try {
      const res = await actionsAPI.copyFile(settings.copyFilePath, settings.copyFileDest);
      console.log(`Copied ${settings.copyFilePath} to ${settings.copyFileDest}`);
      return {
        status: "SUCCESS",
        data: `Copied ${settings.copyFilePath} to ${settings.copyFileDest}`,
      };
    } catch (e) {
      console.warn(`Could not find file named ${settings.copyFilePath}`);
      return {
        status: "ERROR",
        data: `Could not copy file ${settings.copyFilePath}`,
      };
    }
  }

  if (settings.moveFile) {
    try {
      const res = await actionsAPI.moveFile(settings.moveFilePath, settings.moveFileDest);
      console.log(`Moved ${settings.moveFilePath} to ${settings.moveFileDest}`);
      return {
        status: "SUCCESS",
        data: `Moved ${settings.moveFilePath} to ${settings.moveFileDest}`,
      };
    } catch (e) {
      console.warn(`Could not find file named ${settings.moveFilePath}`);
      return {
        status: "ERROR",
        data: `Could not find file named ${settings.moveFilePath}`,
      };
    }
  }

  if (settings.deleteFile) {
    try {
      const res = await actionsAPI.deleteFile(settings.deleteFilePath);
      console.log(`Deleted ${settings.deleteFilePath}`);
      return {
        status: "SUCCESS",
        data: `Deleted file ${settings.deleteFilePath} successfully`,
      };
    } catch (e) {
      console.warn(`Could not find file named ${settings.deleteFilePath}`);
      return {
        status: "ERROR",
        data: `Could not find file named ${settings.deleteFilePath}`,
      };
    }
  }


  if (settings.writeFile) {
    try {
      const writeResult = await actionsAPI.writeFile(settings.writeFilePath, settings.writeFileContents, settings.writeFileOverwrite);
      console.log(`writeResult: ${writeResult}`);
      return {
        status: "SUCCESS",
        data: `Wrote file ${settings.writeFilePath} successfully`,
      };
    } catch (e) {
      console.warn(`Could not write file ${settings.writeFilePath}: `+e);
      return {
        status: "ERROR",
        data: `Could not write file ${settings.writeFilePath}: `+e,
      };
    }
  }


  if (settings.writeDirectory) {
    try {
      const writeResultForDir = await actionsAPI.createDirectory(settings.writeDirectoryPath);
      console.log(`writeResultForDir: ${writeResultForDir}`);
      return {
        status: "SUCCESS",
        data: `Wrote directory ${settings.writeDirectoryPath} successfully`,
      };
    } catch (e) {
      console.warn(`Could not write directory ${settings.writeDirectoryPath}: `+e);
      return {
        status: "ERROR",
        data: `Could not write directory ${settings.writeDirectoryPath}`,
      };
    }
  }


}
