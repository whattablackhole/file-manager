export default class CommandBase {
    execute() {
        throw Error("execute() must be implemented in subclass.");
    }
}