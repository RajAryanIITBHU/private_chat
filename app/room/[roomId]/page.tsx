import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import RoomHeader from "./header";
import RoomContent from "./content";

const page = async ({ params }: { params: { roomId: string } }) => {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden ">
     <RoomHeader roomId={roomId}/>
     <RoomContent roomId={roomId}/>
    </main>
  );
};

export default page;
