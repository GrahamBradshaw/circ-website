import "server-only"
import { Redis } from "@upstash/redis"

const CACHE_PREFIX = "circ:public-content:v1"
const EPOCH_KEY = `${CACHE_PREFIX}:epoch`
const INDEX_KEY = `${CACHE_PREFIX}:keys`
const DEFAULT_TTL_SECONDS = 300
const NULL_SENTINEL = { __circRedisNull: true }

let redisClient: Redis | null | undefined
let warnedAboutRedis = false
let warnedAboutDatabase = false

type RedisValue = string | number | boolean | null | Record<string, unknown> | unknown[]

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    redisClient = null
    return null
  }

  redisClient = new Redis({ url, token })
  return redisClient
}

function warnRedis() {
  if (warnedAboutRedis) return
  warnedAboutRedis = true
  console.warn("Redis cache is unavailable; using PostgreSQL directly.")
}

function warnDatabaseFallback() {
  if (warnedAboutDatabase) return
  warnedAboutDatabase = true
  console.warn("Database unavailable; rendering fallback public content.")
}

function restoreDates<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => restoreDates(item)) as T
  if (!value || typeof value !== "object") return value

  const result: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value)) {
    if (
      (key === "date" || key === "createdAt" || key === "submittedAt") &&
      typeof item === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(item)
    ) {
      result[key] = new Date(item)
    } else {
      result[key] = restoreDates(item)
    }
  }
  return result as T
}

export async function getPublicCached<T>(
  key: string,
  loadFromDatabase: () => Promise<T>,
  fallback: T,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): Promise<T> {
  let databaseFailed = false
  const loadWithFallback = async () => {
    try {
      return await loadFromDatabase()
    } catch (error) {
      databaseFailed = true
      warnDatabaseFallback()
      return fallback
    }
  }

  const redis = getRedis()
  // Redis is a cache: only use it if the key exists. If there is a miss, fetch from DB and then repopulate Redis.
  if (!redis) return loadWithFallback()

  let epoch = 0
  try {
    epoch = Number((await redis.get<number>(EPOCH_KEY)) ?? 0)
    if (!Number.isFinite(epoch)) epoch = 0
  } catch (error) {
    warnRedis()
    return loadWithFallback()
  }

  const redisKey = `${CACHE_PREFIX}:${epoch}:${key}`
  try {
    const cached = await redis.get<RedisValue>(redisKey)
    if (cached !== null && cached !== undefined) {
      if (
        typeof cached === "object" &&
        !Array.isArray(cached) &&
        cached !== null &&
        cached.__circRedisNull === true
      ) {
        return null as T
      }
      return restoreDates(cached as T)
    }
  } catch (error) {
    warnRedis()
    return loadWithFallback()
  }

  // Cache miss: read from the database, then save that value back into Redis.
  const value = await loadWithFallback()
  if (!databaseFailed) {
    try {
      const cacheValue = value === null ? NULL_SENTINEL : (value as RedisValue)
      await redis.set(redisKey, cacheValue, { ex: ttlSeconds })
      await redis.sadd(INDEX_KEY, redisKey)
      await redis.expire(INDEX_KEY, Math.max(ttlSeconds + 60, 3600))
    } catch (error) {
      warnRedis()
    }
  }
  return value
}

export async function invalidatePublicContentCache(): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    // Bump first so concurrent cache fills under the old epoch cannot be read again.
    await redis.incr(EPOCH_KEY)
    const keys = await redis.smembers<string[]>(INDEX_KEY)
    if (keys.length > 0) await redis.del(...keys)
    await redis.del(INDEX_KEY)
  } catch (error) {
    warnRedis()
  }
}
