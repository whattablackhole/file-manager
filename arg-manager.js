import ArgumentParser from "./parsers/arg-parser.js";
import CommandParser from "./parsers/command-parser.js";

export default class ArgManager {
  #args;
  #argParser;
  #cmdParser;

  constructor(argParser, cmdParser) {
    if (!(argParser instanceof ArgumentParser)) {
      throw new Error("ArgumentParser must be provided.");
    }

    if (!(cmdParser instanceof CommandParser)) {
      throw new Error("CommandParser must be provided.");
    }

    this.#cmdParser = cmdParser;
    this.#argParser = argParser;
  }

  initFromProcess(env) {
    this.#args = this.#argParser.parse(env);
  }

  getArg(key) {
    this.#ensureInitialized();

    return this.#args.get("--" + key);
  }

  parseCommand(input) {
    return this.#cmdParser.parse(input);
  }

  #ensureInitialized() {
    if (!this.#args) {
      throw new Error(
        "Arguments have not been initialized. Call initFromEnv() first."
      );
    }
  }
}
