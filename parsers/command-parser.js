import { platform } from "os";
import { InvalidArgument } from "../errors.js";
import ParserBase from "./base.js";
import path from "node:path";

export default class CommandParser extends ParserBase {
  constructor() {
    super();
    this.forbiddenFileNameChars =
      platform() === "win32" ? '[^<>:"\\\\/|?*]+' : "[^/]+";

    this.forbiddenPathNameChars =
      platform() === "win32" ? '[^<>:/"|?*]+?' : ".+?";

    this.driveLetterPattern =
      platform() === "win32" ? `(?:[A-Za-z]:\\\\)?` : "";

    this.pathSeparatorPattern = path.sep.replace(/\\/g, "\\\\");

    this.pathToFileMatcher = `((?:${this.driveLetterPattern})(?:${this.forbiddenPathNameChars}${this.pathSeparatorPattern})?(?:${this.forbiddenFileNameChars}))`;
    this.pathToFolderMatcher = `((?:${this.driveLetterPattern})(?:${this.forbiddenPathNameChars}))`;

    this.filePathToFolderMatcher = `("|')?${this.pathToFileMatcher}\\1\\s+("|')?${this.pathToFolderMatcher}\\3`;

    this.matchers = new Map([
      ["cat", new RegExp(`^cat\\s+("|')?${this.pathToFileMatcher}\\1$`)],
      ["add", new RegExp(`^add\\s+("|')?(${this.forbiddenFileNameChars})\\1$`)],
      [
        "rn",
        new RegExp(
          `^rn\\s+("|')?${this.pathToFileMatcher}\\1\\s+("|')?(${this.forbiddenFileNameChars})\\3$`
        ),
      ],
      ["mv", new RegExp(`^mv\\s+${this.filePathToFolderMatcher}$`)],
      ["compress", new RegExp(`^compress\\s+${this.filePathToFolderMatcher}$`)],
      ["rm", new RegExp(`^rm\\s+("|')?${this.pathToFileMatcher}\\1$`)],
      [
        "decompress",
        new RegExp(`^decompress\\s+${this.filePathToFolderMatcher}$`),
      ],
      ["cp", new RegExp(`^cp\\s+${this.filePathToFolderMatcher}$`)],
      ["cd", new RegExp(`^cd\\s+${this.pathToFolderMatcher}$`)],
      ["ls", /^ls\s*$/],
      ["up", /^up\s*$/],
      [".exit", /^.exit\s*$/],
      ["os", /^os\s+([^\s]+)$/],
      ["hash", new RegExp(`^hash\\s+${this.pathToFileMatcher}$`)],
      ["hash", /^hash\s+([^\s]+)$/],
    ]);
  }

  parse(args) {
    const command = args.trimStart();

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

    const result = command.match(matcher);

    if (result === null) {
      throw new InvalidArgument(
        `Command "${commandName}" has invalid arguments.`
      );
    }

    let checkSpaces = true;

    let parsedArgs = [];

    result.slice(1).forEach((s) => {
      if (s === '"') {
        checkSpaces = !checkSpaces;
      } else if (checkSpaces && s !== undefined) {
        if (s.match(/\s+/)) {
          throw new InvalidArgument(
            `Command "${commandName}" has invalid arguments.`
          );
        } else {
          checkSpaces = false;
        }
        parsedArgs.push(s);
      }
    });

    return { name: commandName, args: parsedArgs };
  }
}
