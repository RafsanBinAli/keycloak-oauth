const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379' // Adjust the URL if your Redis server is running elsewhere
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect the client explicitly
client.connect().catch(console.error);

module.exports = client;
