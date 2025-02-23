import * as dotenv from "dotenv";
dotenv.config();
import he from "he";
import axios from "axios";
import { Client, TwitterStrategy, BlueskyStrategy } from "@humanwhocodes/crosspost";

// Note: Use an app password, not your login password!
const bluesky = new BlueskyStrategy({
	identifier: "cthomas.bsky.social",
	password: process.env.BSKY_APP_PASSWORD,
	host: "bsky.social", // "bsky.social" for most people
});

// Note: OAuth app is required
const twitter = new TwitterStrategy({
	accessTokenKey: process.env.TX_ACCESS_TOKEN,
	accessTokenSecret: process.env.TX_ACCESS_TOKEN_SECRET,
	apiConsumerKey: process.env.TX_API_CONSUMER_KEY,
	apiConsumerSecret: process.env.TX_CONSUMER_SECRET,
});

// create a client that will post to all three
const client = new Client({
	strategies: [bluesky, twitter],
});

async function shortenURL(longUrl) {
	try {
		// Request to is.gd URL shortening service
		const response = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`);
		return response.data;
	} catch (error) {
		console.error('Error shortening URL:', error);
	}
}

async function fetchQuote() {
	try {
		const response = await axios.get("https://www.biblegateway.com/votd/get/?format=json&version=nkjv");
		const decodedContent = he.decode(response.data.votd.text);
		const shortenedUrl = await shortenURL(response.data.votd.permalink);
		return `${decodedContent} - ${response.data.votd.reference} \n${shortenedUrl}`;
	} catch (error) {
		console.error("Error fetching quote:", error);
		return "Inspirational message of the day!";
	}
}

async function postUpdate() {
	try {
		const message = await fetchQuote();
		await client.post(message);
		console.log("Post sent successfully!");
	} catch (error) {
		console.error("Error posting:", error);
	}
}
postUpdate();
