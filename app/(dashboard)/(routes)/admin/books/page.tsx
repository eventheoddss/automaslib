import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const BooksPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const books = await db.book.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="mt-2">
      <div className="pl-6 pt-2">
        <h1 className="text-xl font-semibold">
          Book Collection
        </h1>
      </div>
      

      <div className="p-6">
        <DataTable columns={columns} data={books} />
      </div>

    </section>
   );
}
 
export default BooksPage;