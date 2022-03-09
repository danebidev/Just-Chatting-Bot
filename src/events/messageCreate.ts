import { Message } from "discord.js";
import { Data } from "../index";
import { autoBumpCount } from "../misc/bumpCount";

const name = "messageCreate";

function execute(message: Message, data: Data) {
    
    if (message.author.id == "302050872383242240") autoBumpCount(message, data);

}

export {
    name,
    execute
};
