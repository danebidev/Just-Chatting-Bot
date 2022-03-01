import { createHash, BinaryLike } from "crypto";

function getIdByMention(mention: string | undefined): string | null {

	if(!mention) return null;
	const result = mention.match(/^<@!?(\d{18})>$/);
	if(result == null) return null;
	return result[1]!;

}

function getSHA256Checksum(input: BinaryLike, inputEncoding?: "hex" | "base64" | "base64url" | "binary" | "utf8" | "utf-8" | "utf16le" | "latin1" | "ascii" | "ucs2" | "ucs-2") {

	const hash = createHash("sha256");
	if(inputEncoding) {
		hash.update(input as string, inputEncoding);
	} else {
		hash.update(input);
	}
	return hash.digest("hex");

}

function getDropboxFileSHA256Checksum(file: Buffer) {

	const blocks = splitFile(file, 4 * 1024 * 1024);
	let checksum = "";
	for(const block of blocks) {
		const sum = getSHA256Checksum(block, "binary");
		checksum += sum;
	}
	return getSHA256Checksum(checksum, "hex");

}

function splitFile(file: Buffer, blockSize: number) {

	const blocksNumber = Math.ceil(file.byteLength / blockSize);
	const blocks: Buffer[] = [];

	for(let i = 0; i < blocksNumber; i++) {

		const offset = blockSize * i;
		const block = file.slice(offset, offset + blockSize);
		blocks.push(block);

	}

	return blocks;

}

export {
	getIdByMention,
	getSHA256Checksum,
	getDropboxFileSHA256Checksum
};