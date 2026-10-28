import * as dotenv from "dotenv";
dotenv.config();
import he from "he";
import axios from "axios";
import { Client, BlueskyStrategy } from "@humanwhocodes/crosspost";

// Note: Use an app password, not your login password!
const bluesky = new BlueskyStrategy({
	identifier: "cthomas.bsky.social",
	password: process.env.BSKY_APP_PASSWORD,
	host: "bsky.social", // "bsky.social" for most people
});

// create a client that will post to all three
const client = new Client({
	strategies: [bluesky],
});

async function fetchQuote() {
	try {
		const response = await axios.get("https://www.biblegateway.com/votd/get/?format=json&version=nkjv");
		const decodedContent = he.decode(response.data.votd.text);
		const reference = response.data.votd.reference;
		// Clean HTML entities from the permalink URL
		const permalink = he.decode(response.data.votd.permalink).replaceAll("&amp;", "&");

		if (decodedContent.length > 250) { 
			return `${reference}\n\n${permalink}`; 
		}
		return `"${decodedContent}" - ${reference}\n\n${permalink}`;
	} catch (error) {
		console.error("Error fetching quote:", error);
		return "Inspirational message of the day!";
	}
}

async function postUpdate() {
	try {
		const message = await fetchQuote();
		console.log("Attempting to post message:\n", message);
		await client.post(message);
		console.log("Post sent successfully!");
	} catch (error) {
		console.error("Error posting:", error);
		process.exit(1);
	}
}
postUpdate();