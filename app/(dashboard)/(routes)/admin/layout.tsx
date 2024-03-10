
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await initialProfile();

  const isAdmin = profile?.role === 'ADMIN';

  if (!isAdmin) {
    return redirect("/")
  }

  return <>{children}</>;
};

export default AdminLayout;
