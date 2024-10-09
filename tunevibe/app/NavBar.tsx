"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { ModeToggle } from "./components/ui/ModeToggle";
import useStore from "@/store/useStore";
import { toast } from "react-hot-toast";

import AuthModal from "@/components/AuthModal";

const NavBar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const { openAuthModal, closeAuthModal, error, setError } = useStore();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/home" });
        toast.success("Logout Succeeded！");
    };

    return (
        <div>
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/home" className="text-2xl font-bold">
                        TuneVibe
                    </Link>
                    <nav className="flex items-center space-x-4">
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/home" className="hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/aboutus"
                                    className="hover:underline"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        {session.user?.name || "My Account"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="px-4 py-2 text-base hover:underline"
                                    onClick={() => openAuthModal("login")}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-4 py-2 text-base hover:underline"
                                    onClick={() => openAuthModal("register")}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                        <div className="flex">
                            <ModeToggle />
                        </div>
                    </nav>
                </div>
            </header>

            <AuthModal />
        </div>
    );
};

export default NavBar;
