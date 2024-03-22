import { createClient } from "redis";

const publisher = createClient({
	url: process.env.REDIS_URL,
});

publisher.connect();

export { publisher };
