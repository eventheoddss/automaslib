import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// import { isAdmin } from "@/lib/admin";
 
const f = createUploadthing();
 
const handleAuth = () => {
  const { userId } = auth();
//   const isAuthorized = isAdmin(userId);

  if (!userId ) throw new Error("Unauthorized");
  return { userId };
}

export const ourFileRouter = {
  bookImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  bookAttachment: f(["text", "image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;