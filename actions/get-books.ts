import { Category, Book } from "@prisma/client";
import { db } from "@/lib/db";

type BookWithCategory = Book & {
  category: Category | null;
};

type GetBooks = {
  userId?: string;
  title?: string;
  categoryId?: string;
};

export const getBooks = async ({ title, categoryId }: GetBooks): Promise<BookWithCategory[]> => {
  try {
    const books = await db.book.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    
    return books;
  } catch (error) {
    console.log("[GET_BOOKS]", error);
    return [];
  }
};
