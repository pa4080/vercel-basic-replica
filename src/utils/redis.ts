import { RedisClientType, commandOptions, createClient } from "redis";

const url = process.env.REDIS_URL_LOCAL || process.env.REDIS_URL;

/**
 * const publisher = createClient({
 * 	url,
 * });

 * publisher.on("error", (error) => {
 * 	console.error(`Redis client error:`, error);
 * });

 * const subscriber = createClient({
 * 	url,
 * });

 * subscriber.on("error", (error) => {
 * 	console.error(`Redis client error:`, error);
 * });
 */

let publisher: RedisClientType;

(async () => {
	publisher = createClient({ url });
	publisher.on("error", (error) => {
		console.error(`Redis client error:`, error);
	});
	await publisher.connect();
})();

let subscriber: RedisClientType;

(async () => {
	subscriber = createClient({ url });
	subscriber.on("error", (error) => {
		console.error(`Redis client error:`, error);
	});
	await subscriber.connect();
})();

export { commandOptions, publisher as redisPublisher, subscriber as redisSubscriber };
