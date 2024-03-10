import Link from "next/link";

import { initialProfile } from "@/lib/initial-profile";

const Home = async() => {
  const { profile } = await initialProfile();

  return (
    <section className="my-8 mx-6 p-4">
      <div className="flex flex-col items-center justify-center md:h-screen mx-auto max-w-screen-lg">
        <div className="w-full relative overflow-hidden mb-8">
          <img
            src="/assets/images/homebg.jpg"
            alt="Image description"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <p className="text-3xl font-semibold mb-4">
            Embark on a literary journey with our innovative library!
          </p>
          <p className="text-lg mb-8">
              Embark on a reading adventure with our carefully chosen collection that brings stories to life. From timeless classics to undiscovered gems, our library is your portal to imagination. Explore, learn, and get lost in the magic of books.
          </p>
          <div className="flex flex-col justify-between md:flex-row gap-4">
            <Link href="/search"
              className="w-3/4 md:w-72 bg-white hover:bg-gray-100 p-6 rounded-md transition duration-300 transform hover:scale-105 shadow-md border border-gray-300 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold">Explore</h3>
                <p className="text-sm">Discover your next adventure in our vast collection of books.</p>
            </Link>

            <Link href="/bookmarks"
              className="w-3/4 md:w-72 bg-white hover:bg-gray-100 p-6 rounded-md  transition duration-300 transform hover:scale-105 shadow-md border border-gray-300">
                <h3 className="text-lg font-semibold">Bookmarks</h3>
                <p className="text-sm">Keep track of your favorites and create your reading list.</p>
            </Link>
          </div>
        </div>
        
      </div>
    </section>
    
  )
}

export default Home;