// src/lib/redisClient.ts

import { createClient } from 'redis';
import { config } from '../config/index.js';

// Instance to connect to redis cache
const client = createClient({
    username: config.redisUsername,
    password: config.redisPassword,
    socket: {
        host: config.redisHost,
        port: Number(config.redisPort),
    },
});

client.on('connect', () => console.log('Connected to redis')); // Connection successful
client.on('error', (err) => console.error('Redis error: ', err)); // Throw error

await client.connect();

export default client;
