"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith("/admin");
    const isPlayerPage = pathname?.includes("/resource");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {/* {isAdminPage || isPlayerPage ? (
                    <Link href="/">
                        <Button>
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                    </Link>
                ): (
                    <Link href="/admin/books">
                    <Button size="sm" variant="ghost">
                        Admin Mode
                    </Button>
                    </Link>
                )} */}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
        
    )
}