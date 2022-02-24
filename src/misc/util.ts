function getIdByMention(mention: string): string {

	return mention.match(/^<@!?(\d+)>$/)![1]!;

}

export {
	getIdByMention
};