class ArgumentParseErorr extends Error {
  constructor(reason) {
    super(reason);
  }
}

export class FileManagerArgumentParser {
  #usageHelpMessage = `Correct command usage:
  [] - required arg
  () - optional arg 
npm run start -- [--username=string] (--data=string)
`;

  #invalidFormatMessage = "Invalid argument format";
  #requiredArgsMessage = "Some required arguments weren't provided";
  #parseErrorMessage = "Parse error";
  #invalidArgumentNameMessage = "Invalid argument name";
  #duplicatedArgumentMessage = "Duplicated argument";
  #invalidValueTypeMessage = "Invalid value type";

  #requiredKeysCount = 1;
  #supportedKeys = new Map([["--username", { required: true, type: "string" }]]);

  parseProcessArgs(args, truncCmdArgs = true) {
    const argMap = new Map();

    const argsToParse = truncCmdArgs ? args.slice(2) : args;

    let requiredKeysCount = 0;

    argsToParse.forEach((arg) => {
      let argPair = arg.split("=");

      if (argPair.length !== 2)
        this.#throwArgumentError(this.#parseErrorMessage);

      const key = argPair[0];

      if (!key.startsWith("--"))
        this.#throwArgumentError(this.#invalidFormatMessage);

      if (!(this.#supportedKeys.has(key)))
        this.#throwArgumentError(`${this.#invalidArgumentNameMessage}: ${key}`);

      if (argMap.has(key))
        this.#throwArgumentError(`${this.#duplicatedArgumentMessage}: ${key}`);

      const keyInfo = this.#supportedKeys.get(key);

      const value = argPair[1];

      let parsedValue;

      try {
        parsedValue = this.#parseValue(keyInfo.type, value);
      } catch {
        this.#throwArgumentError(
          `${
            this.#invalidValueTypeMessage
          }: value of ${key} must be of type: ${keyInfo.type}`
        );
      }

      if (keyInfo.required) requiredKeysCount++;

      argMap.set(key, parsedValue);
    });

    if (this.#requiredKeysCount !== requiredKeysCount)
      this.#throwArgumentError(this.#requiredArgsMessage);

    return argMap;
  }

  #parseValue(type, value) {
    switch(type) {
        case "string":
            return value;
        default:
            throw new Error("Unknown value type");
    }
  }

  #throwArgumentError = (reason) => {
    throw new ArgumentParseErorr(`${reason}.\n` + this.#usageHelpMessage);
  };
}
