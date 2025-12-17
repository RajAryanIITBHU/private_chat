"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsername } from "@/hooks/useUsername";
import { client } from "@/lib/eden";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import {format} from "date-fns";
import { useRealtime } from "@/lib/realtime-client";
import { useRouter } from "next/navigation";

const RoomContent = ({ roomId }: { roomId: string }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUsername();
  const router = useRouter()

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
      await client.messages.post({ sender: user, text }, { query: { roomId } });
      setInput("");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message","chat.destroy"],
    onData: (event) => {
      if (event.event === "chat.message") {
        refetch();
      }

      if (event.event === "chat.destroy") {
        router.push("/?destroyed=true");
      }
    }
  })


  return (
    <div className="flex-1  flex flex-col w-full max-w-4xl mx-auto px-6 py-4">
      {/* Room content will go here */}
      <div className="flex-1 w-full overflow--y-auto">
        {messages?.messages.length === 0 && (
          <div className="w-full h-full flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-2xl font-medium mb-2">No messages yet</h2>
            <p className="text-muted-foreground/80">
              Start the conversation by sending a message!
            </p>
          </div>
        )}

        {messages?.messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 border-b border-border backdrop-blur-xs ${
              message.sender === user
                ? "bg-primary/10 text-primary self-end"
                : "bg-accent/20 text-secondary-foreground self-start"
            } max-w-lg rounded-md m-2`}
          >
            <div className="text-[10px] font-semibold mb-1">
              <span className={message.sender === user ? "text-primary" : "text-muted-foreground"}>{message.sender === user ? "You" : message.sender}</span>
              <span className=" text-muted-foreground/80 ml-2">
                {format(message.timestamp, "HH:mm")}
              </span>
            </div>
            <div className="text-base">{message.text}</div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border backdrop-blur-sm ">
        <div className="flex h-12 items-center border-2 focus-within:border-primary/50">
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
    </div>
  );
};

export default RoomContent;
