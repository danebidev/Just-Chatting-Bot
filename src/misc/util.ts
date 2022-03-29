import { readdirSync, existsSync, mkdirSync, createWriteStream } from "fs";
import { Storage, File } from "megajs";

async function downloadAudios() {

	if (!existsSync("./audio")) {
		mkdirSync("./audio");
	}

	const mega = await new Storage({
		email: process.env["MEGAEMAIL"]!,
		password: process.env["MEGAPASSWORD"]!,
		userAgent: "Just Chatting Bot/1.0"
	}).ready;

	Promise.all(mega.root.children!.find(folder => folder.name == "audios")!.children!.map(file => file.link({}))).then(async audioLinks => {

		await mega.close();
		const audioFiles = readdirSync("./audio");

		for (const link of audioLinks) {

			let file = File.fromURL(link);
			file = await file.loadAttributes();

			if(audioFiles.includes(file.name!)) continue;

			const stream = createWriteStream(`./audio/${file.name}`);
			file.download({}).pipe(stream);

		}

	});

}

export {
	downloadAudios
};
