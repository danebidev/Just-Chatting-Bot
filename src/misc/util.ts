export = {
	
	getIdByMention: function(mention: string): string {
		
		return mention.match(/^<@!?(\d+)>$/)![1]!;
		
	}
	
}