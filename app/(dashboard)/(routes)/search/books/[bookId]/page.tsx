
import BookmarkButton from '@/components/bookmark-button';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { File } from 'lucide-react';

interface Book {
  title: string;
  author: string;
  description: string;
  imageUrl: string; 
  categoryId: string;
  attachments: string;
//   status: string;
//   copies: number;
}

interface BookIdProps {
  params: {
    bookId: string
  }
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
    include: {
      attachments: true,
    },
  });

  if (!book) {
    return <p>Book not found.</p>; // Or redirect to error page
  }
  
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const member = await db.profile.findFirst({
    where: {
      id: profile.id,
    }
  });

  return (
    <section className="container px-6 mb-6">
        <div className='flex mb-4 p-6 justify-between'>
          <h1 className="text-xl font-bold">{book.title}</h1>
          <div className="">
            <BookmarkButton
              bookId={params.bookId}
            />
          </div>
        </div>
        
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
                <p className="font-semibold mb-2 text-green-600">Author</p>
                <p className="text-gray-800 mb-4">{book.author}</p>

                <h2 className="font-semibold mb-2 text-green-600">Overview</h2>
                <p className="text-gray-800 mb-4">{book.description}</p>
            </div>
        </div>

        <div className="flex flex-col pb-6 border-b-2">
                <div>
                  <p className="font-semibold mb-2 text-green-600">Publisher</p>
                  <p className="text-gray-800 mb-4">{book.publisher}</p>

                  <p className="font-semibold mb-2 text-green-600">Available Copies</p>
                  <p>{book.copies}</p>
                </div>
                
                { book.attachments.length ? (
                  <>
                    <div className="pt-3">
                      <p className='font-semibold text-green-600 mb-2'>Attachments</p>
                      {book.attachments?.map((attachment) => (
                        <a 
                          href={attachment.url}
                          target="_blank"
                          key={attachment.id}
                          className="flex items-center p-3 w-1/2 bg-sky-200 border text-sky-700 rounded-md hover:underline"
                        >
                          <File />
                          <p className="line-clamp-1 overflow-hidden">
                            {attachment.name}
                          </p>
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="pt-4 text-gray-500 italic"> No e-books available for this resource.</p>
                )}

              
                
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-xl text-green-600">Book Reviews</h2>

            <div className="bg-white flex flex-col h-full">
              { (
                <>
                  <ChatMessages
                    profile={profile}
                    chatId={book.id}
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    socketQuery={{
                      bookId: book.id,
                    }}
                    paramKey="bookId"
                    paramValue={book.id}
                  />
                  <ChatInput
                    name={book.title}
                    apiUrl="/api/socket/messages"
                    query={{
                        bookId: book.id,
                    }}
                  />
                </>
              )}
            </div>
        </div>

    </section>
  );
};

export default BookIdPage;
