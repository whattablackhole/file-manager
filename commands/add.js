import CommandBase from "./base.js";
import path from "node:path";
import fs from "node:fs/promises";

export default class AddCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedPath = path.join(state.curDir, commandInfo.fileName);

    await fs.open(resolvedPath, "w");

    return state;
  }
}
