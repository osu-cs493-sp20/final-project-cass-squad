const redis = require('redis');
const express = require('express');

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT || '6379';

const rateLimitWindowMS = 60000;
const rateLimitNumRequests = 5;

const redisClient =
  redis.createClient(redisPort, redisHost);

exports.getUserTokenBucket = function (ip) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if (err) {
        reject(err);
      } else {
        if (tokenBucket) {
          tokenBucket.tokens = parseFloat(tokenBucket.tokens);
        } else {
          tokenBucket = {
            tokens: rateLimitNumRequests,
            last: Date.now()
          };
        }
        resolve(tokenBucket);
      }
    });
  });
}

exports.saveUserTokenBucket = function (ip, tokenBucket) {
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, tokenBucket, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

exports.applyRateLimit = async function (req, res, next) {
  try {
    const tokenBucket = await getUserTokenBucket(req.ip);
    const timestamp = Date.now();
    const ellapsedMilliseconds = timestamp - tokenBucket.last;
    const newTokens = ellapsedMilliseconds *
      (rateLimitNumRequests / rateLimitWindowMS);
    tokenBucket.tokens += newTokens;
    tokenBucket.tokens = Math.min(
      tokenBucket.tokens,
      rateLimitNumRequests
    );
    tokenBucket.last = timestamp;

    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1;
      /* Save the token bucket back to Redis. */
      await saveUserTokenBucket(req.ip, tokenBucket);
      next();
    } else {
      /* Save the token bucket back to Redis. */
      await saveUserTokenBucket(req.ip, tokenBucket);
      res.status(429).send({
        error: "Too many requests per minute"
      });
    }
  } catch (err) {
    console.error(err);
    next();
  }
}
