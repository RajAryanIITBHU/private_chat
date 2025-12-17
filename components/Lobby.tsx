"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUsername } from "@/hooks/useUsername";
import { client } from "@/lib/eden";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Copy, RefreshCcw, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Lobby = () => {
  const { user, refreshUsername } = useUsername();
  const router = useRouter();
  const [isRoomCreating, setIsRoomCreating] = useState(false);
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      setIsRoomCreating(true);
      const res = await client.room.create.post();

      if (res.status === 200) {
        if (res.data && res.data.roomId) {
          router.push(`/room/${res.data?.roomId}`);
        } else {
          toast.error("Failed to create room. Please try again.");
        }
      }
    },
    onError: () => {
      toast.error("An error occurred while creating the room.");
      setIsRoomCreating(false);
    },
  });

  return (
    <main className="relative w-full min-h-screen flex flex-col justify- items-center p-6">
      {/* Error Block */}
      <div className="relative w-full max-w-md h-48 py-4">
        {(wasDestroyed ||
          error === "room_not_found" ||
          error === "room_full") && (
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="absolute top-6 right-2 text-red-300 hover:bg-red-600/20! hover:text-red-300! p-1!"
            onClick={() => {
              router.replace("/");
            }}
          >
            <X className="size-4 " />
          </Button>
        )}
        {wasDestroyed && (
          <div className="p-4 bg-red-600/20 border border-red-600 text-red-300 rounded-md text-center">
            <span className="font-medium">Room Destroyed!</span>
            <p className="text-xs mt-1">
              The room you were in has been destroyed and all messages have been
              deleted.
            </p>
          </div>
        )}
        {error === "room_not_found" && (
          <div className="p-4 bg-red-600/20 border border-red-600 text-red-300 rounded-md text-center">
            <span className="font-medium">Room Not Found!</span>{" "}
            <p className="text-xs mt-1">
              The room you were trying to access does not exist.
            </p>
          </div>
        )}
        {error === "room_full" && (
          <div className="p-4 bg-red-600/20 border border-red-600 text-red-300 rounded-md text-center">
            <span className="font-medium">Room Full!</span>
            <p className="text-xs mt-1">
              The room you were trying to access is full.
            </p>
          </div>
        )}
      </div>

      {/* Lobby content */}
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl text-primary font-semibold">
            &gt;private_chat
          </h1>
          <p className="text-muted-foreground/80 w-3/4 mx-auto">
            A private <span>self-destructing</span>, <span>encrypted</span> chat
            room.
          </p>
        </div>
        <Card className="w-full p-4">
          <h3 className="text-muted-foreground/80">Your Identity :)</h3>
          <div className="relative flex justify-between items-center p-3 border bg-background min-h-16 group">
            <span className="text-foreground/80">{user ? user : "..."}</span>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="hidden group-hover:flex"
              disabled={!user}
              onClick={() => {
                if (user) {
                  refreshUsername();
                }
              }}
            >
              <RefreshCcw className="size-4 text-accent-foreground/60" />
            </Button>
          </div>
          <Button
            onClick={() => createRoom()}
            size={"lg"}
            variant={"home"}
            className={cn("w-full", isRoomCreating && "cursor-not-allowed ")}
            disabled={isRoomCreating}
          >
            {isRoomCreating ? "Creating Room..." : "Create New Room"}
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default Lobby;
