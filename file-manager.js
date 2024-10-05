import ArgManager from "./arg-manager.js";
import Commander from "./commander.js";
import { createInterface } from "node:readline/promises";
import os from "node:os";
import { InvalidArgument } from "./errors.js";

export default class FileManager {
  #argManager;
  #currentDirectory;
  #commander;

  constructor(argManager, commander, initialDirectory = os.homedir()) {
    if (!(argManager instanceof ArgManager)) {
      throw new Error("Argument manager must be provided.");
    }

    if (!(commander instanceof Commander)) {
      throw new Error("Argument commander must be provided.");
    }

    this.#commander = commander;
    this.#argManager = argManager;
    this.#currentDirectory = initialDirectory;
  }

  async serve() {
    const name = this.#argManager.getArg("username");

    this.#sayHello(name);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(`You are currently in ${this.#currentDirectory}`);

    console.log("Please, provide a command and wait for result");

    rl.on("line", this.#handleCommand);

    rl.on("SIGINT", this.#onExit);
  }

  #sayHello(name) {
    console.log(`Welcome to the File Manager, ${name}!`);
  }

  #sayGoodBye(name) {
    console.log(`Thank you for using File Manager, ${name}, goodbye!`);
  }

  #handleCommand = async (line = "") => {
    try {
      const cmdPayload = this.#argManager.parseCommand(line);

      if (cmdPayload.name === ".exit") {
        this.#onExit();
      }

      const newState = await this.#commander.execute(
        cmdPayload.name,
        { curDir: this.#currentDirectory },
        cmdPayload.commandInfo
      );

      if (newState) {
        this.#currentDirectory = newState.curDir;
      }
    } catch (err) {
      if (err instanceof InvalidArgument) {
        console.log("Invalid input");
      } else {
        console.log("Operation failed");
      }
    } finally {
      console.log(`You are currently in ${this.#currentDirectory}`);
    }
  };

  #onExit = () => {
    const name = this.#argManager.getArg("username");

    this.#sayGoodBye(name);

    process.exit(0);
  };
}
