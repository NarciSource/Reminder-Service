local items = redis.call(
  "ZRANGEBYSCORE",
  KEYS[1],
  "-inf",
  ARGV[1]
)

if #items == 0 then
  return {}
end

redis.call("ZREM", KEYS[1], unpack(items))

return items