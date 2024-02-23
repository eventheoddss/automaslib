import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { bookId: string, attachmentId: string }}
) {
   try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const bookOwner = await db.book.findUnique({
            where: {
                id: params.bookId,
                userId: userId
            }
        })

        if (!bookOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const attachment = await db.attachment.delete({
            where: {
                bookId: params.bookId,
                id: params.attachmentId
            }
        })

        return NextResponse.json(attachment);
   } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500});
   } 
}