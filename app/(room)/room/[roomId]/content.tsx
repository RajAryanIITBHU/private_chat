"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsername } from "@/hooks/useUsername";
import { client } from "@/lib/eden";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Copy, LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RoomContent = ({ roomId }: { roomId: string }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const [input, setInput] = useState("");
  const [copyStatus, setCopyStatus] = useState<"copy room link" | "copied!">(
    "copy room link"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUsername();
  const router = useRouter();

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      //Send message to api
       isUserScrollingRef.current = false;
      setInput("");
      await client.messages.post({ sender: user, text }, { query: { roomId } });
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: (event) => {
      if (event.event === "chat.message") {
         isUserScrollingRef.current = false;
        refetch();
      }

      if (event.event === "chat.destroy") {
        router.push("/?destroyed=true");
      }
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
    setCopyStatus("copied!");
    setTimeout(() => setCopyStatus("copy room link"), 2000);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isUserScrollingRef.current) {
      scrollToBottom();
    }
  }, [messages?.messages.length]);

  return (
    <>
      <div className="w-full h-full overflow-y-auto mb-4 flex flex-col ">
        {messages?.messages.length === 0 && (
          <div className="w-full h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-medium mb-2">No messages yet</h2>
            <p className="text-muted-foreground/80">
              Start the conversation by sending a message!
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="mt-4 z-1"
                disabled={copyStatus === "copied!"}
                onClick={handleCopy}
              >
                <span className="mr-2">{copyStatus.toUpperCase()}</span>
                <Copy size={16} />
              </Button>
              <Button
                
                className="mt-4 z-1 bg-primary/80 hover:bg-primary/60 border-none backdrop-blur-sm text-foreground!"
                onClick={handleCopy}
              >
                <span className="mr-2 uppercase">share</span>
                <LinkIcon size={16} />
              </Button>
            </div>
          </div>
        )}
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          {messages?.messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b border-border backdrop-blur-xs  ${
                message.sender === user
                  ? "bg-primary/10 text-primary self-end"
                  : "bg-accent/20 text-secondary-foreground self-start"
              } max-w-lg rounded-md m-2`}
            >
              <div className="text-[10px] font-semibold mb-1">
                <span
                  className={
                    message.sender === user
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {message.sender === user ? "You" : message.sender}
                </span>
                <span className=" text-muted-foreground/80 ml-2">
                  {format(message.timestamp, "HH:mm")}
                </span>
              </div>
              <div className="text-base">{message.text}</div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border backdrop-blur-sm sticky bottom-0 bg-secondary/30  ">
        <div className="flex h-12 items-center border-2 focus-within:border-primary/50 max-w-4xl mx-auto w-full">
          <label
            htmlFor="input-chat"
            className="h-full aspect-square flex items-center justify-center  peer-focus-within:animate-pulse text-primary"
          >
            &gt;
          </label>
          <input
            ref={inputRef}
            id="input-chat"
            autoFocus
            type="text"
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim() !== "") {
                sendMessage({ text: input.trim() });
                inputRef.current?.focus();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="peer flex-1 h-full bg-transparent outline-none border-none text-foreground/80 placeholder:text-muted-foreground "
          />
          <button
            onClick={() => {
              sendMessage({ text: input.trim() });
              inputRef.current?.focus();
            }}
            disabled={input.trim() === "" || isPending}
            className="ml-2 px-5 h-full bg-accent text-sm peer-focus:bg-primary/70 hover:bg-primary/50"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomContent;
