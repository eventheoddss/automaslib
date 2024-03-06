
import { Book, Category, Profile } from "@prisma/client";
import { db } from "@/lib/db";

type BookmarkedBook = Book & {
    category: Category | null;
//   profile: Profile | null;
};

type GetBookmarks = {
  userId: string;
  search?: string; 
  categoryId?: string;
};

export const getBookmarks = async ({ userId, search, categoryId }: GetBookmarks): Promise<BookmarkedBook[]> => {
  try {
    const bookmarks = await db.book.findMany({
      where: {
        isPublished: true,
        bookmarks: {
          some: {
            profileId: userId,
          },
        },
        ...(search ? {
            OR: [
              { title: { contains: search } },
              { author: { contains: search } },
              { publisher: { contains: search } },
            ],
          } : {}),
          categoryId
      },
      include: {
        category: true
        // profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookmarks;
  } catch (error) {
    console.log("[GET_BOOKMARKS]", error);
    return [];
  }
};
