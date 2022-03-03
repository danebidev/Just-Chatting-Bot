import { expect } from "chai";
import { describe } from "mocha";
import { getIdByMention } from "../../src/misc/util";

describe("util", () => {

	describe("#getIdByMention()", () => {

		it("should return the mention id", () => {
			expect(getIdByMention("<@012345678910111213>")).to.equal("012345678910111213");
			expect(getIdByMention("<@131211109876543210>")).to.equal("131211109876543210");
		});

		it("should work with exclamation marks", () => {
			expect(getIdByMention("<@!012345678910111213>")).to.equal("012345678910111213");
			expect(getIdByMention("<@!131211109876543210>")).to.equal("131211109876543210");
		});

		it("should return null with invalid ids", () => {
			expect(getIdByMention("<@01234567891011121>")).to.equal(null);
			expect(getIdByMention("<@0134232>")).to.equal(null);
			expect(getIdByMention("<@4636453453463424f>")).to.equal(null);
			expect(getIdByMention("<@?131211109876543210>")).to.equal(null);
		});

	});

});