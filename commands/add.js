import CommandBase from "./base.js";
import path from "node:path";
import fs from "node:fs/promises";

export default class AddCommand extends CommandBase {
  async execute(state, [fileName]) {
    const resolvedPath = path.join(state.curDir, path.parse(fileName).name);

    await fs.open(resolvedPath, "w");

    return state;
  }
}
