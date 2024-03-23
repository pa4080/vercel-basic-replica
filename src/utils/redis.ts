import { commandOptions, createClient } from "redis";

const publisher = createClient({
	url: process.env.REDIS_URL,
});

publisher.connect();

export { commandOptions, publisher as redisPublisher };
