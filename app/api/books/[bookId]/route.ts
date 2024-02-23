import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params} : {params: {bookId: string}}
){
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const book = await db.book.findUnique({
            where: {
                id: params.bookId,
                userId: userId
            }
        });

        if (!book) {
            return new NextResponse("Not found", { status: 404});
        }

        const deletedBook = await db.book.delete({
            where: {
                id: params.bookId,
            }
        })

        return NextResponse.json(deletedBook);

    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: {bookId: string}}
) {
    try {
        const { userId } = auth();
        const { bookId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const book = await db.book.update({
            where: {
                id: bookId,
                userId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(book);
    } catch (error) {
        console.log("[BOOK_ID]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}