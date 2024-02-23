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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CopiesFormProps {
  initialData: Book;
  bookId: string;
}

const formSchema = z.object({
  copies: z
  .string()
  .min(1, { message: "required"})
  .transform((v) => Number(v)||0)
  // z
  // .number()
  // .min(0, {
  //    message: "Copies must be non-negative" 
  // })
});

export const CopiesForm = ({
  initialData,
  bookId,
}: CopiesFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
//   const [count, setCount] = useState(initialData?.copies || 0);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      copies: initialData?.copies || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/books/${bookId}`, values);
      toast.success("Book updated");
      toggleEdit();
    //   setCount(values.copies); // Update state for counter display
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-2">
        <span>Available Copies</span>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit copies
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
            "text-sm", 
            !initialData.copies && "text-slate-500 italic"
        )}>
          {initialData.copies || "No copies available"}
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
                name="copies"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="flex items-center gap-2">
                                {/* <Button
                                onClick={() => setCount(Math.max(count - 1, 0))}
                                disabled={isSubmitting}
                                variant="ghost"
                                >
                                -
                                </Button> */}
                                <Input
                                // {...form.getFieldState("copies")}
                                type="number"
                                min={0}
                                //   value={count}
                                // onInput={(e) => setCount(Number(e.currentTarget.value))}
                                disabled={isSubmitting}
                                placeholder="Enter number of copies"
                                { ...field }
                                />
                                {/* <Button
                                onClick={() => setCount(count + 1)}
                                disabled={isSubmitting}
                                variant="ghost"
                                >
                                +
                                </Button> */}
                            </div>
                        </FormControl>
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
