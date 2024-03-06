import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Book, Bookmark, Profile } from "@prisma/client"

export type BookWithProfiles = Book & {
   profile: Profile [];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type SafeProfile = Omit<
  Profile,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  bookmarks: Bookmark[];
};