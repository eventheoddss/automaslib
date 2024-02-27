import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, bookId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }


    const book = await db.book.findFirst({
        where: {
          id: bookId as string,
        },
      });
    
    if (!book) {
    return res.status(404).json({ error: "Book not found" });
    }

    // const member = server.members.find((member) => member.profileId === profile.id);

    // if (!member) {
    //   return res.status(404).json({ error: "Member not found" });
    // }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string
      },
      include: {
        profile: true,
      }
    })

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.profileId === profile.id;
    const canModify = isMessageOwner

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
            profile: true,
          
        }
      })
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
            profile: true,
        }
      })
    }

    const updateKey = `chat:${bookId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}