import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    console.log(body);

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    console.log(idToAdd);

    const session = await getServerSession(authOptions);

    if (!session) throw new Response("Unauthorized", { status: 401 });

    // Check if the user is already friends with the user
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends)
      throw new Response("Already friends", { status: 400 });

    // Check if the user has a pending request from the user
    const hasPendingRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasPendingRequest) throw new Response("Bad Request", { status: 400 });

    // Add the user to the friends list
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);

    // Add the user to the other user's friends list
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    // Remove the user from the incoming friend requests list
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    // Remove the user from the outgoing friend requests list (Not Implemented Yet)

    // Return Response
    return new Response("OK", { status: 200 });
  } catch (error) {
    {
      if (error instanceof z.ZodError) {
        return new Response("Invalid request", { status: 422 });
      }

      return new Response("Internal server error", { status: 400 });
    }
  }
}
