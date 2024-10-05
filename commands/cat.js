import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { stat } from "node:fs/promises";

export default class CatCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedPath = path.resolve(state.curDir, commandInfo.pathToFile);

    const info = await stat(resolvedPath);

    if (!info.isFile()) {
      throw new Error("File not found.");
    }

    const readableStream = fs.createReadStream(resolvedPath, {
      encoding: "utf-8",
    });

    await pipeline(readableStream, process.stdout, { end: false });

    return state;
  }
}
