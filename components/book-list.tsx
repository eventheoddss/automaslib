import { Category, Book } from "@prisma/client";

import { BookCard } from "@/components/book-card";

type AvailableBook = Book & {
  category: Category | null;
};

interface BookListProps {
  items: AvailableBook[];
}

export const BookList = ({
  items
}: BookListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <BookCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            author={item.author!}
            category={item?.category?.name!}
            publisher={item.publisher!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No matches found
        </div>
      )}
    </div>
  )
}