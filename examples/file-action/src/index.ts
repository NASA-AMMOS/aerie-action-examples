import type {
  ActionsAPI,
  ActionParameterDefinitions,
  ActionSettingDefinitions,
  ActionParameters,
  ActionSettings,
} from "@nasa-jpl/aerie-actions";

export const parameterDefinitions = {} satisfies ActionParameterDefinitions;
export const settingDefinitions = {} satisfies ActionSettingDefinitions;

type MyActionParameters = ActionParameters<typeof parameterDefinitions>;
type MyActionSettings = ActionSettings<typeof settingDefinitions>;

export async function main(
    _parameters: MyActionParameters,
    _settings: MyActionSettings,
    actionsAPI: ActionsAPI
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = "test";
  const originalFile = `${dir}/${timestamp}.txt`;
  const copiedFile = `${dir}/${timestamp}.copy.txt`;
  const movedFile = `${dir}/${timestamp}.moved.txt`;

  try {
    // Ensure the directory exists
    await actionsAPI.createDirectories(dir);

    // Write the original file
    const contents = `This is a test file created at ${timestamp}`;
    await actionsAPI.writeFile(originalFile, contents, true);
    console.log(`Wrote file: ${originalFile}`);

    // Copy the file
    await actionsAPI.copyFile(originalFile, copiedFile);
    console.log(`Copied to: ${copiedFile}`);

    // Move the copy
    await actionsAPI.moveFile(copiedFile, movedFile);
    console.log(`Moved to: ${movedFile}`);

    // Delete the moved copy
    await actionsAPI.deleteFile(movedFile);
    console.log(`Deleted: ${movedFile}`);

    return {
      status: "SUCCESS",
      data: `Created ${originalFile}, copied to ${copiedFile}, then moved the copy to ${movedFile}, then deleted the copy.`,
    };
  } catch (e) {
    console.error("Error during file operations:", e);
    return {
      status: "ERROR",
      data: `File operation failed: ${e}`,
    };
  }
}
