"use client";

import { UserIcon } from "lucide-react";
import Link from "next/link";
import React, { FC, useState } from "react";

interface FriendRequestSidebarOptionProps {
  initialUnseenFriendRequests: number;
  sessionId: string;
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
  initialUnseenFriendRequests,
  sessionId,
}) => {
  const [unseenFriendRequests, setUnseenFriendRequests] = useState<number>(
    initialUnseenFriendRequests
  );

  return (
    <Link
      href="/dashboard/requests"
      className="textgray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md  text-sm leading-6 font-semibold"
    >
      <div
        className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600
      flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white
      "
      >
        <UserIcon className="h-4 w-4" />
      </div>
      <p className="truncate">Friend Requests</p>

      {unseenFriendRequests > 0 && (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unseenFriendRequests}
        </div>
      )}
    </Link>
  );
};

export default FriendRequestSidebarOption;
