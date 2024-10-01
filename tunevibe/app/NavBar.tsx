"use client";
import React, { useState } from "react";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleLogin = () => {
        // Implement actual login logic here
        setIsLoggedIn(true);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowProfile(false);
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
                            <Link href="/aboutus" className="hover:underline">
                                    About
                                </Link>
                            </li>
                        </ul>
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        My Account
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setShowProfile(true)}
                                    >
                                        Profile
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLoginModal(true)}
                            >
                                Login
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Login or Sign Up</DialogTitle>
                        <DialogDescription>
                            Enter your details to access your account or create
                            a new one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input id="email" placeholder="Email" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                        <Button onClick={handleLogin}>Login</Button>
                        <Button variant="outline">Sign Up</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NavBar;
