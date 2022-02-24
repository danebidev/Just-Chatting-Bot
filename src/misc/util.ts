function getIdByMention(mention: string | undefined): string | null {

	if(!mention) return null;
	const result = mention.match(/^<@!?(\d{18})>$/);
	if(result == null) return null;
	return result[1]!;

}

export {
	getIdByMention
};