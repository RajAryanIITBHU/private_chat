"use client";
import { client } from "@/lib/eden";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import RoomsListItem from "./room-list-item";

const RoomsList = () => {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["publicRooms"],
    queryFn: async () => {
      //Fetch public rooms from api
      const res = await client.public_rooms.get();
      return res.data;
    },
  });

  return (
    <div className="h-full w-full overflow-y-auto py-4">
      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading rooms...</p>
      ) : data && data.rooms.length > 0 ? (
        <ul className="space-y-4">
          {data.rooms.map((room: RoomItem) => (
            <RoomsListItem key={room.roomId} {...room} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted-foreground">
          No public rooms available.
        </p>
      )}
    </div>
  );
};

export default RoomsList;
