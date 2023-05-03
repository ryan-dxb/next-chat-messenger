import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) throw new Response("Unauthorized", { status: 401 });

    // ... Parse body
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    // ... Check if the user has a pending request from the user
    const hasPendingRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToDeny
    );

    if (!hasPendingRequest) throw new Response("Bad Request", { status: 400 });

    // ... Remove the user from the incoming friend requests list
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    // ... Return Response
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
