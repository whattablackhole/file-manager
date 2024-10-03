import CommandBase from "./base.js";
import { readdir } from "node:fs/promises";

export default class LsCommand extends CommandBase {
  async execute(state) {
    let dirInfo;
    dirInfo = await readdir(state.curDir, {
      withFileTypes: true,
    });

    const tableData = dirInfo
      .filter((d) => d.isDirectory() || d.isFile())
      .sort((a, b) => {
        if (
          (a.isDirectory() && b.isDirectory()) ||
          (a.isFile() && b.isFile())
        ) {
          return a.name.localeCompare(b.name);
        }
        if (a.isDirectory()) {
          return -1;
        } else {
          return 1;
        }
      })
      .map((d) => {
        return {
          Name: d.name,
          Type: d.isDirectory() ? "directory" : "file",
        };
      });
    console.table(tableData);
  }
}
