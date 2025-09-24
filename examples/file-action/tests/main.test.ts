import { main } from "../src";

import assert from 'node:assert';
import { test, mock } from "node:test";
import type {ActionsAPI} from "@nasa-jpl/aerie-actions";
import {ReadDictionaryResult, ReadParcelResult} from "@nasa-jpl/aerie-actions/dist/types/db-types";

// The basic-action example makes a `fetch` call to an external URL when it runs.
// This test avoids relying on making an actual call to an external URL by "mocking"
// the `fetch` API and replacing it with our own test function.

// create a mock Response-like object
function createMockResponse(data) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    clone: function() {
      return createMockResponse(data);
    }
  };
}

// mock function for copyFile
const mockCopyFile = mock.fn(async (source: string, dest: string) => {});


// TS utility that lets us mock only selected parts of an object,
// while treating it as a fully-typed instance of the whole thing.
function createMock<T extends object>(overrides: {
  copyFile: (source: string, dest: string) => Promise<void>;
  deleteFile: (source: string) => Promise<void>;
  readDictionaryFile(filePath: string): Promise<string>;
  getEnvironmentVariable(name: string): (string | undefined);
  readParameterDictionary(id: number): Promise<ReadDictionaryResult>;
  moveFile: (source: string, dest: string) => Promise<void>;
  readCommandDictionary(id: number): Promise<ReadDictionaryResult>;
  readFile: (name: string) => Promise<void>;
  readParcel(id: number): Promise<ReadParcelResult>;
  createDirectory: (name: string) => Promise<void>;
  readChannelDictionary(id: number): Promise<ReadDictionaryResult>;
  writeFile: (name: string, definition: string, overwrite: boolean) => Promise<void>;
  listFiles: (path: string) => Promise<any[]>;
  createDirectories: (name: string) => Promise<void>
}): T {
  return overrides as T;
}

// create a partial mock of the actions API, so we can test it without making real database calls
// TODO: extract createMockActionsAPI into aerie-actions TestUtils package
const mockActionsAPI = createMock<ActionsAPI>({
  readChannelDictionary(id: number): Promise<ReadDictionaryResult> {
    return Promise.resolve(undefined);
  }, getEnvironmentVariable(name: string): string | undefined {
    return undefined;
  }, readCommandDictionary(id: number): Promise<ReadDictionaryResult> {
    return Promise.resolve(undefined);
  }, readDictionaryFile(filePath: string): Promise<string> {
    return Promise.resolve("");
  }, readParameterDictionary(id: number): Promise<ReadDictionaryResult> {
    return Promise.resolve(undefined);
  }, readParcel(id: number): Promise<ReadParcelResult> {
    return Promise.resolve(undefined);
  },
  readFile: async (name: string) => {},
  writeFile: async (name: string, definition: string, overwrite: boolean) => {},
  listFiles: async (path: string) => {return []},
  copyFile: mockCopyFile,
  moveFile: async (source: string, dest: string) => {},
  deleteFile: async (source: string) => {},
  createDirectory: async (name: string) => {},
  createDirectories: async (name: string) => {}
});

test("aerie files example action", async (t) => {

  await t.test("runs main", async () => {
    await main(
      {
      },
      {
        copyFile: true,
        copyFilePath: "dir1/test.json",
        copyFileDest: "dir1/copy.json",
        readFile: undefined,
        readFilePath: undefined,
        readDirectory: undefined,
        readDirectoryPath: undefined,
        writeFile: undefined,
        writeFilePath: undefined,
        writeFileContents: undefined,
        writeFileOverwrite: undefined,
        writeDirectory: undefined,
        writeDirectoryPath: undefined,
        writeDirectoryOverwrite: undefined,
        moveFile: undefined,
        moveFilePath: undefined,
        moveFileDest: undefined,
        deleteFile: undefined,
        deleteFilePath: undefined,
      },
      mockActionsAPI,
    );
    assert.equal(mockCopyFile.mock.calls.length, 1, "copyFile should have been called once");
  });
});
