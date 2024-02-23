
interface Book {
  title: string;
  author: string;
  description: string;
  coverImage: string; // assuming a URL or path to the image
  category: string;
//   status: string;
//   copies: number;
  // ... other book details
}

const BookDetailsPage: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:mr-4">
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-64 object-cover md:h-auto" // scale image on desktop
            />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">{book.author}</p>
          <p className="mb-4">{book.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p className="font-bold">Category:</p>
              <p>{book.category}</p>
            </div>
            {/* <div>
              <p className="font-bold">Status:</p>
              <p>{book.status}</p>
            </div>
            <div>
              <p className="font-bold">Copies:</p>
              <p>{book.copies}</p>
            </div> */}
            {/* ... more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
