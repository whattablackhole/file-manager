import { InvalidArgument } from "../errors.js";
import ParserBase from "./base.js";

export default class CommandParser extends ParserBase {
  matchers = new Map([
    ["cd", /^cd\s+([^\s]+)$/],
    ["cat", /^cat\s+([^\s]+)$/],
    ["add", /^add\s+([^\s]+)$/],
    ["rn", /^rn\s+([^\s]+)$/],
    ["mv", /^mv\s+([^\s]+)\s+([^\s]+)$/],
    ["os", /^os\s+([^\s]+)$/],
    ["compress", /^compress\s+([^\s]+)\s+([^\s]+)$/],
    ["rm", /^rm\s+([^\s]+)$/],
    ["decompress", /^decompress\s+([^\s]+)\s+([^\s]+)$/],
    ["hash", /^hash\s+([^\s]+)$/],
    ["cp", /^cp\s+([^\s]+)\s+([^\s]+)$/],
    ["ls", /^ls\s*$/],
    ["up", /^up\s*$/],
    [".exit", /^.exit\s*$/],
  ]);

  parse(args) {
    const command = args.trim();

    if (!command) {
      throw new InvalidArgument("No command provided.");
    }

    const parts = command.match(/\S+/g);

    if (!parts) {
      throw new InvalidArgument("Invalid command format.");
    }

    const commandName = parts[0];
    const matcher = this.matchers.get(commandName);

    if (!matcher) {
      throw new InvalidArgument(`Unknown command: ${commandName}`);
    }

    const result = matcher.exec(command);

    if (!result) {
      throw new InvalidArgument(
        `Command "${commandName}" has invalid arguments.`
      );
    }

    return { name: commandName, args: result.slice(1) };
  }
}
