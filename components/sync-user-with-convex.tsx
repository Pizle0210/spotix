"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function SyncUserWithConvex() {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) return;

    async function syncUser() {
      await updateUser({
        userId: user!.id,
        name: `${user!.firstName ?? ""} ${user!.lastName ?? ""}`.trim(),
        email: user!.emailAddresses[0]?.emailAddress ?? "",
      });
      try {
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Cannot update user at the moment";
        throw new Error(errorMessage);
      }
    }

    syncUser();
  }, [user, updateUser]);
  return null;
}
