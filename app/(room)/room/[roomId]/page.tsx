import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import RoomHeader from "./header";
import RoomContent from "./content";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { roomId: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;
  return {
    title: `Room ${roomId}`,
    description: `Join the private chat room with ID ${roomId}. Share the link to invite others and start chatting securely!`,
  };
}

const page = async ({ params }: { params: { roomId: string } }) => {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;

  return (
    <main className="grid h-screen max-h-screen overflow-hidden grid-cols-1 grid-rows-[auto_1fr_auto]  w-full">
      <RoomHeader roomId={roomId} />
      <RoomContent roomId={roomId} />
    </main>
  );
};

export default page;
