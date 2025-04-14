const { LRUCache } = require('lru-cache');

// Initialize rate limiter
const rateLimit = parseInt(process.env.RATE_LIMIT || '120', 10);
const rateLimiter = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 minute in milliseconds
});

// Parse API keys from environment
const getApiKeys = () => {
  const apiKeysStr = process.env.API_KEYS || '';
  const keyPairs = apiKeysStr.split(',');

  const apiKeys = {};
  keyPairs.forEach(pair => {
    const [key, source] = pair.split(':');
    if (key && source) {
      apiKeys[key] = source;
    }
  });

  return apiKeys;
};

// Authentication middleware
const authenticate = (req) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return {
      success: false,
      status: 401,
      message: 'API key is required'
    };
  }

  const apiKeys = getApiKeys();
  const source = apiKeys[apiKey];

  if (!source) {
    return {
      success: false,
      status: 401,
      message: 'Invalid API key'
    };
  }

  return {
    success: true,
    source
  };
};

// Rate limiting middleware
const checkRateLimit = (req) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const identifier = `${clientIp}`;

  const currentCount = rateLimiter.get(identifier) || 0;

  if (currentCount >= rateLimit) {
    return {
      success: false,
      status: 429,
      message: 'Rate limit exceeded. Try again in 1 minute.'
    };
  }

  rateLimiter.set(identifier, currentCount + 1);
  return { success: true };
};

module.exports = {
  authenticate,
  checkRateLimit
};