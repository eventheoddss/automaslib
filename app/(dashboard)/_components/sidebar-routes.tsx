"use client"

import { BookMarked, Home, LayoutDashboard, Library, LibraryBig, Users } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Home,
        label: "Home",
        href: "/",
    },
    {
        icon: Library,
        label: "Discover",
        href: "/search",
    },
    {
        icon: BookMarked,
        label: "Bookmarks",
        href: "/bookmarks",
    },
]
   
const adminRoutes = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        icon: LibraryBig,
        label: "Books",
        href: "/admin/books",
    },
    {
        icon: Users,
        label: "Users",
        href: "/admin/users",
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isAdminPage = pathname?.includes("/admin")

    const routes = isAdminPage ? adminRoutes : guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}