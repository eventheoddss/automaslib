import {db} from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { IconBadge } from "@/components/icon-badge";
import { BookPlus, File, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { AuthorForm } from "./_components/author-form";
import { AttachmentForm } from "./_components/attachment-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/action";
import { CopiesForm } from "./_components/copies-form";
import { PublisherForm } from "./_components/publisher-form";

const BookIdPage = async ({
    params
}: {
    params: { bookId: string}
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const book = await db.book.findUnique({
        where: {
            id: params.bookId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc"
                },
            },
        },
    })
    
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    })
    // console.log(categories);

    if (!book) {
        return redirect("/")
    }

    const requiredFields = [
        book.title,
        book.author,
        book.description,
        book.imageUrl,
        book.categoryId,
        book.copies,
        book.publisher
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!book.isPublished && (
                <Banner 
                    label="This book is not listed to the users!"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1>
                            Book Creation
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                     <Actions 
                        disabled={!isComplete}
                        bookId={params.bookId}
                        isPublished={book.isPublished}
                     />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={BookPlus}/>
                            <h2 className="text-xl">
                                Enter the Book Details
                            </h2>
                        </div>
                        <TitleForm 
                            initialData={book}
                            bookId={book.id}
                        />
                        <AuthorForm 
                            initialData={book}
                            bookId={book.id}
                        />
                        <PublisherForm 
                            initialData={book}
                            bookId={book.id}
                        />
                        <CopiesForm
                            initialData={book}
                            bookId={book.id}
                        />
                        <CategoryForm 
                            initialData={book}
                            bookId={book.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                        <DescriptionForm 
                            initialData={book}
                            bookId={book.id}
                        />
                        <ImageForm
                            initialData={book}
                            bookId={book.id}
                        />
                        <div className="space-y-6 mt-6">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={File}/>
                                        <h2 className="">
                                            E-Resources(optional)
                                        </h2>
                                </div>
                                <AttachmentForm
                                    initialData={book}
                                    bookId={book.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    );
}
 
export default BookIdPage;