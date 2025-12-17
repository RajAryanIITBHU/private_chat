"use client";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/eden";
import { cn } from "@/lib/utils";
import { formatTimeRemaining } from "@/utils/formatTimeRemaining";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bomb, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const RoomHeader = ({ roomId }: { roomId: string }) => {
  const [copyStatus, setCopyStatus] = useState<"copy" | "copied!">("copy");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const router = useRouter();

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } });
    },
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      setTimeout(() => {
        setTimeRemaining(ttlData.ttl);
      }, 0);
    }
  }, [ttlData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;

    if (timeRemaining === 0) {
      router.push("/?destroyed=true");
      return;
    }
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
    setCopyStatus("copied!");
    setTimeout(() => setCopyStatus("copy"), 2000);
  };



  return (
    <header className="sticky top-0 border-b border-border py-4 px-6  bg-secondary/30 backdrop-blur-sm z-10">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
     
        <div className="flex items-center  gap-8 flex-1">
          <div className="flex flex-col gap-1">
            <span className="uppercase text-muted-foreground/80 text-xs">
              Room ID:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-primary">
                {roomId}
              </span>
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={handleCopy}
                className="text-[10px] text-accent-foreground/60 px-1.5! py-1! h-fit"
              >
                <Copy className="size-3" />
                {copyStatus.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center flex-1 ">
          <h3 className="uppercase text-muted-foreground/80 text-xs">
            Self destruct
          </h3>
          <span
            className={cn(
              "font-mono font-medium",

              timeRemaining !== null && timeRemaining <= 60
                ? "text-red-500"
                : timeRemaining !== null && timeRemaining <= 60 * 5
                ? "text-yellow-500"
                : "text-primary"
            )}
          >
            {timeRemaining !== null
              ? formatTimeRemaining(timeRemaining)
              : "--:--"}
          </span>
        </div>
        <div className=" flex-1 flex justify-end">
          <Button
            variant={"secondary"}
            className="text-[10px] h-fit hover:bg-red-600/80 transition-colors border hover:border-red-500"
            onClick={() => {
              destroyRoom();
            }}
          >
            <Bomb className="size-3" /> DESTROY ROOM
          </Button>
        </div>
      </div>
    </header>
  );
};

export default RoomHeader;
