import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";

export default class CatCommand extends CommandBase {
  async execute(state, [pathToFile]) {
    const resolvedPath = path.resolve(state.curDir, pathToFile);

    const readableStream = fs.createReadStream(resolvedPath, {
      encoding: "utf-8",
    });

    await pipeline(readableStream, process.stdout, { end: false });

    return state;
  }
}
