import CommandBase from "./base.js";
import path from "node:path";
import * as fsAsync from "node:fs/promises";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

export default class CopyCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedFilePath = path.resolve(state.curDir, commandInfo.pathToFile);

    const file = await fsAsync.stat(resolvedFilePath);

    if (!file.isFile()) {
      throw new Error("Can't copy unknown type.");
    }

    const destinationFolderPath = path.resolve(
      state.curDir,
      commandInfo.pathToFolder
    );

    const folder = await fsAsync.stat(destinationFolderPath);

    if (!folder.isDirectory()) {
      throw new Error("Can't copy to unknown destination.");
    }

    const destinationFilePath = path.join(
      destinationFolderPath,
      path.basename(resolvedFilePath)
    );

    const readStream = fs.createReadStream(resolvedFilePath);
    const writeStream = fs.createWriteStream(destinationFilePath);

    await pipeline(readStream, writeStream);

    return state;
  }
}
