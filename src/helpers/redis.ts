const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisUrl}/${command}/${args.join("/")}`;

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${upstashRedisToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Error executing redis command: ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();

  return data.result;
}
