import { platform } from "os";
import { InvalidArgument } from "../errors.js";
import ParserBase from "./base.js";
import path from "node:path";

export default class CommandParser extends ParserBase {
  constructor() {
    super();
    this.forbiddenFileNameChars =
      platform() === "win32" ? '[^<>:"\\\\/|?*]+' : "(?!\\.{1,2}$)[^/]+";

    this.forbiddenPathNameChars =
      platform() === "win32" ? '[^<>:/"|?*]+?' : ".+?";

    this.driveLetterPattern =
      platform() === "win32" ? `(?:[A-Za-z]:\\\\)?` : "";

    this.pathSeparatorPattern = path.sep.replace(/\\/g, "\\\\");

    this.pathToFileMatcher = `(?<pathToFile>(?:${this.driveLetterPattern})(?:${this.forbiddenPathNameChars}${this.pathSeparatorPattern})?(?:${this.forbiddenFileNameChars}))`;
    this.pathToFolderMatcher = `(?<pathToFolder>(?:${this.driveLetterPattern})(?:${this.forbiddenPathNameChars}))`;
    this.filePathToFolderMatcher = `(?<pathToFileQuotes>"|')?${this.pathToFileMatcher}\\1\\s+(?<pathToFolderQuotes>"|')?${this.pathToFolderMatcher}\\3`;

    this.matchers = new Map([
      [
        "cat",
        new RegExp(
          `^cat\\s+(?<pathToFileQuotes>"|')?${this.pathToFileMatcher}\\1$`
        ),
      ],
      [
        "add",
        new RegExp(
          `^add\\s+(?<fileNameQuotes>"|')?(?<fileName>${this.forbiddenFileNameChars})\\1$`
        ),
      ],
      [
        "rn",
        new RegExp(
          `^rn\\s+(?<pathToFileQuotes>"|')?${this.pathToFileMatcher}\\1\\s+(?<fileNameQuotes>"|')?(?<fileName>${this.forbiddenFileNameChars})\\3$`
        ),
      ],
      ["mv", new RegExp(`^mv\\s+${this.filePathToFolderMatcher}$`)],
      ["compress", new RegExp(`^compress\\s+${this.filePathToFolderMatcher}$`)],
      [
        "rm",
        new RegExp(
          `^rm\\s+(?<pathToFileQuotes>"|')?${this.pathToFileMatcher}\\1$`
        ),
      ],
      [
        "decompress",
        new RegExp(`^decompress\\s+${this.filePathToFolderMatcher}$`),
      ],
      ["cp", new RegExp(`^cp\\s+${this.filePathToFolderMatcher}$`)],
      ["cd", new RegExp(`^cd\\s+${this.pathToFolderMatcher}$`)],
      ["ls", /^ls\s*$/],
      ["up", /^up\s*$/],
      [".exit", /^.exit\s*$/],
      ["os", /^os\s+--(?<osCommandType>EOL|cpus|homedir|username|architecture)\s*$/],
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

    let { groups } = result;

    if (groups) {
      if (groups.pathToFile && !groups.pathToFileQuotes) {
        this.#validateWhiteSpaceAbsence(commandName, groups.pathToFile);
      }
      if (groups.pathToFolder && !groups.pathToFolderQuotes) {
        this.#validateWhiteSpaceAbsence(commandName, groups.pathToFolder);
      }
      if (groups.fileName && !groups.fileNameQuotes) {
        this.#validateWhiteSpaceAbsence(commandName, groups.fileName);
      }
    }

    return { name: commandName, commandInfo: groups };
  }

  #validateWhiteSpaceAbsence(commandName, input) {
    if (input.match(/\s+/))
      throw new InvalidArgument(
        `Command "${commandName}" has invalid arguments.`
      );
  }
}
