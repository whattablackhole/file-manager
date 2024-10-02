import { FileManagerArgumentParser } from "./arg-parser.js";


function main() {
    const parser = new FileManagerArgumentParser();

    try {
        const args = parser.parseProcessArgs(process.argv);
        const name = args.get("--username");
        console.log(`Welcome to the File Manager, ${name}!`);
    } catch(err) {
        console.log(err.message);
        process.exit(0);
    }
    
}


main();