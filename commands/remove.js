import CommandBase from "./base.js";
import path from "node:path";
import fs from "node:fs/promises";

export default class RemoveCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedFilePath = path.resolve(state.curDir, commandInfo.pathToFile);
    await fs.unlink(resolvedFilePath);

    return state;
  }
}
