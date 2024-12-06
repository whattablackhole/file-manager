import CommandBase from "./base.js";
import path from "node:path";
import fs from "node:fs/promises";

export default class RenameCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedPath = path.resolve(state.curDir, commandInfo.pathToFile);
    const file = await fs.stat(resolvedPath);

    if (!file.isFile()) {
      throw new Error("Can't rename unknown type.");
    }

    const newFilePath = path.join(
      path.dirname(resolvedPath),
      commandInfo.fileName
    );
    await fs.rename(resolvedPath, newFilePath);

    return state;
  }
}
