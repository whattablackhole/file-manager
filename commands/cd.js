import CommandBase from "./base.js";
import path from "node:path";
import { stat } from "fs/promises";

export default class CdCommand extends CommandBase {
  async execute(state, [dedicatedPath]) {
    const resolvedPath = path.resolve(state.curDir, dedicatedPath);

    await stat(resolvedPath);

    return { curDir: resolvedPath };
  }
}
