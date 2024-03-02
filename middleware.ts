import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({});
 
export const config = {
  publicRoutes: ["/api/uploadthing"],
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};