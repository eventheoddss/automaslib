import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const book = await db.book.findUnique({
      where: {
        id: params.bookId,
        userId,
      },
    });

    if (!book) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (!book.title || !book.author || !book.description || !book.imageUrl || !book.categoryId || !book.copies) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedBook = await db.book.update({
      where: {
        id: params.bookId,
        userId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedBook);
  } catch (error) {
    console.log("[BOOK_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}