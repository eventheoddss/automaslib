import Link from "next/link";

import { initialProfile } from "@/lib/initial-profile";

const Home = async() => {
  const { profile } = await initialProfile();

  return (
    <section className="mt-8 mb-10 mx-6 p-4">
      <div className="flex flex-col items-center justify-center h-screen mx-auto max-w-screen-lg">
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
            Uncover worlds within words, as our curated collection brings stories to life.
            From the classics that stand the test of time to hidden gems waiting to be discovered,
            our library is your gateway to imagination. Explore, learn, and lose yourself in the magic of words.
          </p>
          <div>
          <Link href="/search" className="bg-black text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-300 hover:text-black transition duration-300">
              Explore
            </Link>
          </div>
        </div>
        
      </div>
    </section>
    
  )
}

export default Home;