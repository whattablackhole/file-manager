import CommandBase from "./base.js";
import os from "node:os";

export default class OsCommand extends CommandBase {
  async execute(state, commandInfo) {
    switch (commandInfo.osCommandType) {
      case "EOL":
        console.log(JSON.stringify(os.EOL));
        break;
      case "homedir":
        console.log(os.homedir());
        break;
      case "cpus":
        const cpus = os.cpus();
        console.log(`Total CPUs: ${cpus.length}`);

        const tableData = cpus.map((cpu) => {
          return {
            Model: cpu.model,
            "Clock Rate": `${(cpu.speed / 1000).toFixed(2)} GHz`,
          };
        });
        console.table(tableData);
        break;
      case "username":
        console.log(os.userInfo().username);
        break;
      case "architecture":
        console.log(os.arch());
        break;
      default:
        throw new Error("Uknown command type");
    }
    return state;
  }
}
