
export default class ParserBase {
  constructor() {
    if (new.target === ParserBase) {
      throw new Error("Cannot instantiate abstract class Parser directly.");
    }
  }

  parse() {
    throw new Error("parse() must be implemented in a subclass.");
  }
}
