"use clinet";

import { Button } from "@/components/ui/button";
import { formatTimeRemaining } from "@/utils/formatTimeRemaining";
import { format } from "date-fns";
import { Copy, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";




const RoomsListItem = ({
  roomId,
  connected,
  createdAt,
  duration,
  people,
  visibility,
  ttl,
}: RoomItem) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(ttl ?? null);


  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;
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

  return (
    <li
      key={roomId}
      className="p-4 border border-border rounded-lg bg-accent/40 backdrop-blur-sm transition flex  items-center"
    >
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <Link href={`/room/${roomId}`}>
            <span className="text-muted-foreground hover:text-primary text-sm pr-4">
              {roomId}
            </span>
          </Link>
        </div>
        <div className="flex gap-6 items-center text-xs flex-wrap">
          <div className="flex gap-1 items-center">
            <span className="text-[10px] text-muted-foreground/70 uppercase">
              time remaining:
            </span>
            <span>
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>

          <div className="flex gap-1 items-center">
            <span className="text-[10px] text-muted-foreground/70 uppercase">
              people:
            </span>
            <span>{`${connected.length}/${people}`}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-[10px] text-muted-foreground/70 uppercase">
              created:{" "}
            </span>
            <span className="">{format(createdAt, "HH:mm")}</span>
          </div>
        </div>
      </div>

      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 "></div>
      <div className="flex gap-2">
        
        <Button variant={"outline"} className="p-2! aspect-square">
          <Link href={`/room/${roomId}`}>
            <Copy className="size-3" />
          </Link>
        </Button>
        <Button variant={"home"}>
          <Link href={`/room/${roomId}`}>Join Room</Link>
        </Button>
      </div>
    </li>
  );
};

export default RoomsListItem