import CommandBase from "./base.js";
import path from "node:path";
import fs from "node:fs/promises";

export default class RenameCommand extends CommandBase {
  async execute(state, [pathToFile, fileName]) {
    const resolvedPath = path.resolve(state.curDir, pathToFile);

    await fs.open(resolvedPath, "w");

    return state;
  }
}
