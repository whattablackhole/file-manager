import FileManager from "./file-manager.js";
import ArgManager from "./arg-manager.js";
import ArgumentParser from "./parsers/arg-parser.js";
import CommandParser from "./parsers/command-parser.js";
import Commander from "./commander.js";
import LsCommand from "./commands/ls.js";
import UpCommand from "./commands/up.js";
import CdCommand from "./commands/cd.js";
import CatCommand from "./commands/cat.js";
import AddCommand from "./commands/add.js";
import MoveCommand from "./commands/move.js";
import CompressCommand from "./commands/compress.js";
import RenameCommand from "./commands/rename.js";
import CopyCommand from "./commands/copy.js";
import RemoveCommand from "./commands/remove.js";
import OsCommand from "./commands/os.js";
import HashCommand from "./commands/hash.js";
import DecompressCommand from "./commands/decompress.js";

export default class App {
  start() {
    const commander = new Commander();

    commander
      .add("ls", new LsCommand())
      .add("up", new UpCommand())
      .add("cd", new CdCommand())
      .add("cat", new CatCommand())
      .add("mv", new MoveCommand())
      .add("rn", new RenameCommand())
      .add("rm", new RemoveCommand())
      .add("os", new OsCommand())
      .add("compress", new CompressCommand())
      .add("decompress", new DecompressCommand())
      .add("hash", new HashCommand())
      .add("cp", new CopyCommand())
      .add("add", new AddCommand());

    const argManager = new ArgManager(
      new ArgumentParser(),
      new CommandParser()
    );
    
    try {
      argManager.initFromProcess(process.argv);
    } catch {
      console.log("Invalid input.");
    }
    

    const manager = new FileManager(argManager, commander);

    manager.serve();
  }
}
