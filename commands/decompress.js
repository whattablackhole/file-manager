import CommandBase from "./base.js";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import * as fsAsync from "node:fs/promises";
import zlib from "node:zlib";

export default class DecompressCommand extends CommandBase {
  async execute(state, commandInfo) {
    const resolvedFilePath = path.resolve(state.curDir, commandInfo.pathToFile);

    const file = await fsAsync.stat(resolvedFilePath);

    if (!file.isFile()) {
      throw new Error("Can't decompress unknown type.");
    }

    const destinationFolderPath = path.resolve(
      state.curDir,
      commandInfo.pathToFolder
    );

    const folder = await fsAsync.stat(destinationFolderPath);

    if (!folder.isDirectory()) {
      throw new Error("Can't decompress to unknown destination.");
    }

    const fileNameWithoutExtension = path.basename(resolvedFilePath, ".br");

    const destinationFilePath = path.join(
      destinationFolderPath,
      fileNameWithoutExtension
    );

    const readStream = fs.createReadStream(resolvedFilePath);
    const writeStream = fs.createWriteStream(destinationFilePath);

    const brotli = zlib.createBrotliDecompress();

    console.log("Decompressing...");

    await pipeline(readStream, brotli, writeStream);

    return state;
  }
}
