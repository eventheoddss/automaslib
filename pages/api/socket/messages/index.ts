import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content } = req.body;
    const { bookId } = req.query;
    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }    
  
    if (!bookId) {
      return res.status(400).json({ error: "Book ID missing" });
    }
          
    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const book = await db.book.findFirst({
      where: {
        id: bookId as string,
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // const member = book.members.find((member) => member.profileId === profile.id);

    // if (!member) {
    //   return res.status(404).json({ message: "Member not found" });
    // }

    const message = await db.message.create({
      data: {
        content,
        bookId: bookId as string,
        profileId: profile.id,
      },
    });

    const bookKey = `chat:${bookId}:messages`;

    res?.socket?.server?.io?.emit(bookKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" }); 
  }
}