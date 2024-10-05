import CommandBase  from "./commands/base.js";

export default class Commander {
    #commands = new Map();

    add(alias, command) {
        if (!(command instanceof CommandBase)) {
            throw new Error("Command argument must be provided.");
        }
        
        this.#commands.set(alias, command);

        return this;
    }

    async execute(alias, state, commandInfo) {
        return await this.#commands.get(alias).execute(state, commandInfo);
    }

}