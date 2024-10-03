import path from "node:path";
import CommandBase from "./base.js";

export default class UpCommand extends CommandBase {
  async execute(state) {
    if (path.parse(state.curDir).root == state.curDir) {
        return state;
    }
    
    const resolvedPath = path.resolve(state.curDir, "..");
    return { curDir: resolvedPath };
  }
}
