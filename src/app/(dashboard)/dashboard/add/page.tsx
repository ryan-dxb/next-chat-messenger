import AddFriendButton from "@/app/components/AddFriendButton";
import { NextPage } from "next";

interface AddFriendProps {}

const AddFriend: NextPage<AddFriendProps> = () => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default AddFriend;
