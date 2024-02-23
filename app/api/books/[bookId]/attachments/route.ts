import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { bookId: string}}
) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const bookOwner = await db.book.findUnique({
            where: {
                id: params.bookId,
                userId: userId,
            }
        });

        if (!bookOwner) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                bookId: params.bookId,
            }
        })

        return NextResponse.json(attachment);
        
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}