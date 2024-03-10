import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getBookmarks } from "@/actions/get-bookmarks";
import { BookList } from "@/components/book-list";
import { Categories } from "../search/_components/categories";

interface BookmarksPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const BookmarksPage = async ({
  searchParams
}: BookmarksPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const bookmarks = await getBookmarks({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <h2 className="font-semibold text-xl">Your Favorite Collection</h2>
        {bookmarks.length > 0 ? (
            <>
                {/* <Categories
                    items={categories}
                /> */}
                <BookList items={bookmarks} />
            </>
            
        ) : (
          <div className="flex flex-col items-center justify-center h-screen gap-y-4">
            <h2 className="font-semibold text-2xl">You have no bookmarks yet.</h2>
            <p className="text-sm">Books you mark as favorite will be displayed here.</p>
          </div>
        )}
      </div>
    </>
   );
}
 
export default BookmarksPage;