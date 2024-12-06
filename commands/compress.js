import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import * as fsAsync from "node:fs/promises";
import zlib from "node:zlib";

export default class CompressCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedFilePath = path.resolve(state.curDir, commandInfo.pathToFile);

    const file = await fsAsync.stat(resolvedFilePath);

    if (!file.isFile()) {
      throw new Error("Can't compress unknown type.");
    }

    const destinationFolderPath = path.resolve(
      state.curDir,
      commandInfo.pathToFolder
    );

    const folder = await fsAsync.stat(destinationFolderPath);

    if (!folder.isDirectory()) {
      throw new Error("Can't compress to unknown destination.");
    }

    const destinationFilePath = path.join(
      destinationFolderPath,
      path.basename(resolvedFilePath) + ".br"
    );

    const readStream = fs.createReadStream(resolvedFilePath);
    const writeStream = fs.createWriteStream(destinationFilePath);

    const brotli = zlib.createBrotliCompress();

    console.log("Compressing...");

    await pipeline(readStream, brotli, writeStream);

    return state;
  }
}
