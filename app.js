import FileManager from "./file-manager.js";
import ArgManager from "./arg-manager.js";
import ArgumentParser from "./parsers/arg-parser.js";
import CommandParser from "./parsers/command-parser.js";
import Commander from "./commander.js";
import LsCommand from "./commands/ls.js";
import UpCommand from "./commands/up.js";
import CdCommand from "./commands/cd.js";
import CatCommand from "./commands/cat.js";


export default class App {
  start() {
    const commander = new Commander();

    commander
      .add("ls", new LsCommand())
      .add("up", new UpCommand())
      .add("cd", new CdCommand())
      .add("cat", new CatCommand())
      // .add("rn", () => {})
      // .add("rm", () => {})
      // .add("compress", () => {})
      // .add("decompress", ()=>{})
      // .add("hash", ()=>{})
      // .add("mv", ()=>{})
      // .add("cp", ()=>{})
      // .add("add", ()=>{});
    

    const argManager = new ArgManager(new ArgumentParser(), new CommandParser());

    argManager.initFromProcess(process.argv);

    const manager = new FileManager(argManager, commander);

    manager.serve();
  }
}
