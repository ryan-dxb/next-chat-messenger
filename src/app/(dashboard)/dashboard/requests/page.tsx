import FriendRequests from "@/app/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const Requests = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  // Current loogind in user's friend requests
  const friendRequests = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  // Fetch friend requests from Redis
  const incomingFriendRequests = await Promise.all(
    friendRequests.map(async (friendRequestId) => {
      const sender = (await fetchRedis(
        "get",
        `user:${friendRequestId}`
      )) as string;

      const senderObj = JSON.parse(sender);

      return {
        senderId: friendRequestId,
        senderEmail: senderObj.email,
      };
    })
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Requests;
