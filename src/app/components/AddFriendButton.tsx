"use client";

import React, { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validEmail = await addFriendValidator.parse({ email });
      if (!validEmail) return console.error("Invalid email");

      const response = await axios.post("/api/friends/add", {
        email: validEmail,
      });

      if (response.status === 200) {
        setShowSuccessState(true);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        setError("email", {
          message: error.message,
        });
        console.error(error.message);
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", {
          message: error.response?.data,
        });

        console.error(error.response?.data);
        return;
      }

      setError("email", {
        message: "Something went wrong",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-500">Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendButton;
