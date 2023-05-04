import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  try {
    // Get current user friends
    const friends = (await fetchRedis(
      "smembers",
      `user:${userId}:friends`
    )) as string[];

    // Get User data for each friend
    const friendsData = await Promise.all(
      friends.map(async (friendId) => {
        const friend = (await fetchRedis("get", `user:${friendId}`)) as string;

        const friendParsed = JSON.parse(friend) as User;

        return friendParsed;
      })
    );

    return friendsData as User[];
  } catch (error) {
    console.log(error);
  }
};
