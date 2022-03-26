import { config } from "dotenv";
import { readCommands, registerCommands } from "./util";

config();

const commands = readCommands();
registerCommands(commands);