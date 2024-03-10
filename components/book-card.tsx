import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  category: string;
  publisher: string;
};

export const BookCard = ({
  id,
  title,
  imageUrl,
  author,
  category,
  publisher,
}: BookCardProps) => {
  return (
    <Link href={`/search/books/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-green-600 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">
            {author}
          </p>
          <p className="text-xs italic text-muted-foreground pt-1">
            {publisher}
          </p>
          <div className="text-xs pt-2">
            {category}
          </div>
        </div>
      </div>
    </Link>
  )
}