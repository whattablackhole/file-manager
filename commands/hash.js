import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import * as fsAsync from "node:fs/promises";
import fs from "node:fs";
import crypto from "node:crypto";

export default class HashCommand extends CommandBase {
  async execute(state, commandInfo) {
    const hash = crypto.createHash("sha256");

    const pathToFile = path.resolve(state.curDir, commandInfo.pathToFile);

    const fileInfo = await fsAsync.stat(pathToFile);

    if (!fileInfo.isFile()) {
      throw new Error("Can't hash unknown type.");
    }

    let readableStream = fs.createReadStream(pathToFile);

    await pipeline(readableStream, hash);

    console.log(hash.digest("hex"));

    return state;
  }
}
