"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";


interface TitleFormProps {
    initialData: {
        title: string;
    }
    bookId: string;
}

const formSchema = z.object({
    title: z
    .string()
    .min(1, {
        message: "Title is required"
    })
    .refine(value => value.trim() !== '' || value.length === 0, {
        message: "Input value cannot be blank"
    })
    .refine((value) => {
        return /^[A-Za-z0-9\s]+$/.test(value);
    }, {
        message: "Invalid characters",
    })
});



export const TitleForm = ({
    initialData,
    bookId
}: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current) 

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const { isSubmitting, isValid } = form.formState;
    

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
                Book Title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ): (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'The Stranger'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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