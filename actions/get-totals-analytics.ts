import { db } from "@/lib/db";
import { Book, Message, Bookmark, Profile } from "@prisma/client";

export const getTotalsAnalytics = async (): Promise<{
  totalBooks: number;
  totalUsers: number;
  totalMessages: number;
  totalBookmarks: number;
}> => {
  try {
    const totalBooks = await db.book.count();
    const totalUsers = await db.profile.count();
    const totalMessages = await db.message.count();
    const totalBookmarks = await db.bookmark.count();

    return {
      totalBooks,
      totalUsers,
      totalMessages,
      totalBookmarks,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      totalBooks: 0,
      totalUsers: 0,
      totalMessages: 0,
      totalBookmarks: 0,
    };
  }
};

