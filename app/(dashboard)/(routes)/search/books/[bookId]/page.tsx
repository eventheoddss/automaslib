
import { db } from '@/lib/db';

interface Book {
  title: string;
  author: string;
  description: string;
  imageUrl: string; 
  categoryId: string;
//   status: string;
//   copies: number;
}

const BookIdPage = async ({
  params
}: {
  params: { bookId: string; }
}) => {
  const book = await db.book.findUnique({
    where: {
      id: params.bookId,
    },
  });

  if (!book) {
    return <p>Book not found.</p>; // Or redirect to error page
  }

  return (
    <section className="container px-6 mb-6">
        <h1 className="text-xl font-bold p-6 mb-4">{book.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:mr-4">
                {book.imageUrl && (
                    <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-100 object-cover md:h-100"
                />
                )}
            </div>

            <div>
                <p className="font-bold mb-2 text-green-600">Author</p>
                <p className="text-gray-800 mb-4">{book.author}</p>

                <h2 className="font-bold mb-2 text-green-600">Overview</h2>
                <p className="text-gray-800 mb-4">{book.description}</p>
            </div>
        </div>

        <div className="flex flex-col pb-6 border-b-2">
                {/* <div className="mb-3">
                    <p className="font-bold mb-2 text-green-600">CategoryId</p>
                    <p>{book.categoryId}</p>
                </div> */}
                {/* <div>
                <p className="font-bold">Status:</p>
                <p>{book.status}</p>
                </div> */}
                <div>
                  <p className="font-bold mb-2 text-green-600">Available Copies</p>
                  <p>{book.copies}</p>
                </div>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-xl text-green-600">Book Reviews</h2>
        </div>

    </section>
  );
};

export default BookIdPage;
