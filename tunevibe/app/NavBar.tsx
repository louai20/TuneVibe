"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

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
import { ModeToggle } from "./components/ui/ModeToggle";

const NavBar = () => {
  const { data: session } = useSession();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setShowLoginModal(false);
      setError("");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register");
      } else {
        // auto login after successfully register
        await signIn("credentials", {
          redirect: false,
          email: registerEmail,
          password: registerPassword,
        });
        setShowRegisterModal(false);
        setError("");
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  const handleLogout = async () => {
    await signOut();
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
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {session.user?.name || "My Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
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
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-base hover:underline"
                  onClick={() => setShowRegisterModal(true)}
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

      {/* Login dialog */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your email and password to login.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500">{error}</p>}
            <Input
              id="login-email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <Input
              id="login-password"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            >
              Don't have an account? Sign Up
            </Button>
            {/* login via Spotify */}
            <Button
              variant="outline"
              onClick={() => signIn("spotify")}
            >
              Login with Spotify
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* register dialog */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Create a new account by filling out the information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500">{error}</p>}
            <Input
              id="register-name"
              placeholder="Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <Input
              id="register-email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <Input
              id="register-password"
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Sign Up</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
            >
              Already have an account? Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavBar;
