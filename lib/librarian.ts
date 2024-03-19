export const isLibrarian = (userId?: string | null) => {
    return userId === process.env.NEXT_PUBLIC_LIBRARIAN_ID;
  }