
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { bookId: string } }
) {
    try {
        const { userId } = auth();
        const { bookId } = params;

        if (!userId || !bookId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the bookmark exists
        const existingBookmark = await db.bookmark.findFirst({
            where: {
                profileId: userId,
                bookId: bookId,
            },
        });

        if (!existingBookmark) {
            // If bookmark doesn't exist, return a 404 response
            return new NextResponse("Not Found", { status: 404 });
        }

        // If bookmark exists, delete it
        await db.bookmark.delete({
            where: {
                id: existingBookmark.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DELETE /api/bookmarks/[bookId]]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { bookId: string } }
) {
    try {
        const { userId } = auth();
        const { bookId } = params;

        if (!userId || !bookId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the bookmark already exists
        const existingBookmark = await db.bookmark.findFirst({
            where: {
                profileId: userId,
                bookId: bookId,
            },
        });

        if (existingBookmark) {
            // If bookmark exists, remove it
            await db.bookmark.delete({
                where: {
                    id: existingBookmark.id,
                },
            });
        } else {
            // If bookmark doesn't exist, create it
            await db.bookmark.create({
                data: {
                    profileId: userId,
                    bookId: bookId,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[POST /api/bookmarks/[bookId]]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
