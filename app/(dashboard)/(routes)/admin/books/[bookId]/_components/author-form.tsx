"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Book } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";



interface AuthorFormProps {
    initialData: Book;
    bookId: string;
}

const formSchema = z.object({
    author: z
    .string()
    .min(1, {
        message: "Author is required"
    })
    .refine(value => value.trim() !== '' || value.length === 0, {
        message: "Space cannot be the first character"
    })
    .refine(value => /^[A-Za-z\s]+$/.test(value), {
        message: "Author must contain only alphabet letters and spaces"
    })
});

export const AuthorForm = ({
    initialData,
    bookId
}: AuthorFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current) 

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
        ?{
            author: initialData?.author || ""
        } : {},
    })

    const { isSubmitting, isValid, errors } = form.formState;
    

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/books/${bookId}`, values);
            toast.success("Book updated")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }


    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Book Author
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ): (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit author
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.author && "text-slate-500 italic"
                )}>
                    {initialData.author || "No author"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField 
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Albert Camus'"
                                            {...field}
                                        />
                                    </FormControl>
                                    {errors.author && (
                                        <FormMessage>
                                            {errors.author.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}