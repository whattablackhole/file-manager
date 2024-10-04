import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";

export default class MoveCommand extends CommandBase {
  async execute(state, [pathToFile, destPath]) {

    const file = path.resolve(state.curDir, pathToFile);
    const fileDest = path.resolve(state.curDir, destPath)

    return state;
  }
}
