import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs/promises";

export default class CompressCommand extends CommandBase {
  async execute(state, commandInfo) {
    const file = path.resolve(state.curDir, commandInfo.pathToFile);
    const fileDest = path.resolve(state.curDir, commandInfo.pathToFolder);

    let pathToFileStats = await fs.stat(file);
    let destPathStats = await fs.stat(fileDest);

    if (!pathToFileStats.isFile()) {
      throw new Error("Incorrect file name");
    }

    if (!destPathStats.isDirectory()) {
      throw new Error("Incorrect path");
    }

    return state;
  }
}
