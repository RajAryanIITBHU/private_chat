import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import { z } from "zod";
import { Message, realtime } from "@/lib/realtime";

const rooms = new Elysia({ prefix: "/room" })
  .post("/create", async ({body}) => {
    const roomId = nanoid();

    const { duration, people, visibility } = body;

    // Store room metadata
    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
      duration,
      people,
      visibility,
    });

    await redis.expire(`meta:${roomId}`, duration * 60);

    return { roomId };
  },{
    body: z.object({
      duration: z.number(),
      people: z.number(),
      visibility: z.string(),
    }),
  })
  .use(authMiddleware)
  .get(
    "/ttl",
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);
      return { ttl: ttl > 0 ? ttl : 0 };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )
  .delete(
    "/",
    async ({ auth }) => {
      await realtime
        .channel(auth.roomId)
        .emit("chat.destroy", { isDestroyed: true });
      await Promise.all([
        await redis.del(auth.roomId),
        await redis.del(`meta:${auth.roomId}`),
        await redis.del(`messages:${auth.roomId}`),
      ]);

    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ auth, body }) => {
      const { sender, text } = body;
      const { roomId } = auth;

      const roomExists = await redis.exists(`meta:${roomId}`);
      if (!roomExists) {
        throw new Error("Room does not exist");
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
      };

      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });
      await realtime.channel(roomId).emit("chat.message", message);

      const remaining = await redis.ttl(`meta:${roomId}`);
      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(`meta:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    }
  )
  .get(
    "/",
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1
      );

      return {
        messages: messages.map((m) => ({
          ...m,
          token: m.token === auth.token ? m.token : undefined,
        })),
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const public_rooms = new Elysia({ prefix: "/public_rooms" })
  .get(
    "/",
    async () => {
      const keys = await redis.keys("meta:*");
      const rooms = [];
      for (const key of keys) {
        const roomId = key.split(":")[1];
        const meta = await redis.hgetall<MetaData>(key);
        
        if(!meta){
          continue;
        }

        if (meta.visibility === "Public") {
          const ttl = await redis.ttl(key);
          if (ttl <= 0 || meta.people <= meta.connected.length) {
            continue;
          }
          rooms.push({
            roomId,
            ttl,
            ...meta,
          });
        }
      }
      return { rooms };
    }
  );

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages).use(public_rooms);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
