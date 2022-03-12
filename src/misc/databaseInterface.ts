import { Data } from "../index";

function init(data: Data) {

	data.database.connect().then(dbClient => {
		dbClient.query("SELECT * FROM bumps;").then(res => {

			for (const row of res.rows) {
				data.bumps.set(row.id, row.bumps);
			}

		});
	}).catch(err => console.error(err));

}

async function addGuildToDB(guildID: string, data: Data) {

	const client = await data.database.connect();
	client.query(`INSERT INTO Guilds (ID) VALUES (${guildID})`);

}

export {
	init,
	addGuildToDB
};