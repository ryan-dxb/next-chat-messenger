"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const router = useRouter();

  const friendRequestHandler = ({
    senderId,
    senderEmail,
  }: IncomingFriendRequest) => {
    setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
  };

  // Realtime friend request
  // Cant use colon in channel name so created a util function to replace it
  useEffect(() => {
    pusherClient
      .subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      .bind("incoming_friend_request", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );

      pusherClient.unbind("incoming_friend_request", friendRequestHandler);
    };
  }, [sessionId]);

  // End of realtime friend request

  const acceptFriendRequest = async (senderId: string) => {
    await axios.post("/api/friends/accept", {
      id: senderId,
    });

    setFriendRequests((prev) =>
      prev.filter((friendRequest) => friendRequest.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriendRequest = async (senderId: string) => {
    await axios.post("/api/friends/deny", {
      id: senderId,
    });

    setFriendRequests((prev) =>
      prev.filter((friendRequest) => friendRequest.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">No Friends Request</p>
      ) : (
        friendRequests.map((friendRequest) => (
          <div key={friendRequest.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{friendRequest.senderEmail}</p>
            <button
              onClick={() => acceptFriendRequest(friendRequest.senderId)}
              aria-label="accept-friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full hover:shadow-md transition"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => denyFriendRequest(friendRequest.senderId)}
              aria-label="deny-friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full hover:shadow-md transition"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
