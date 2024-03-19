import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { UserDataTable } from "../books/_components/user-data-table";
import { userColumns } from "../books/_components/user-columns";

const UsersPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const profiles = await db.profile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="mt-2">
      <div className="pl-6 pt-2">
        <h1 className="text-xl font-semibold">
          Registered Users
        </h1>
      </div>
      

      <div className="p-6">
        <UserDataTable columns={userColumns} data={profiles} />
      </div>

    </section>
   );
}
 
export default UsersPage;