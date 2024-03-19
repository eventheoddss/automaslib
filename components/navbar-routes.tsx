"use client"

import { UserButton, useAuth } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isLibrarian } from "@/lib/librarian";

export const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith("/admin");
    const isSearchPage = pathname === "/search";
    const isBookmarksPage = pathname === "/bookmarks";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            {isBookmarksPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isAdminPage ? (
                    <Link href="/">
                        <Button variant="ghost">
                            <LogOut className="h-4 w-4 mr-2"/>
                            Home
                        </Button>
                    </Link>
                ): isLibrarian(userId) ? (
                    <Link href="/admin/dashboard">
                        <Button size="sm" variant="ghost">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin
                        </Button>
                    </Link>
                ): null}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
        
    )
}