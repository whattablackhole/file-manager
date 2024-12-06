import CommandBase from "./base.js";
import path from "node:path";
import { stat } from "fs/promises";

export default class CdCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedPath = path.resolve(state.curDir, commandInfo.pathToFolder);

    await stat(resolvedPath);

    return { curDir: resolvedPath };
  }
}
