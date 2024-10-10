"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore, { User } from "@/store/useStore";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

const AuthModal: React.FC = () => {
    const {
        authModal: { isOpen, mode },
        closeAuthModal,
        openAuthModal,
        setUser,
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        registerName,
        setRegisterName,
        registerEmail,
        setRegisterEmail,
        registerPassword,
        setRegisterPassword,
        error,
        setError,
    } = useStore();

    const router = useRouter();

    if (!isOpen || !mode) return null;

    const handleLogin = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            email: loginEmail,
            password: loginPassword,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            // const userData: User = {
            //     id: "user-id", 
            //     name: "User Name", 
            //     email: loginEmail,
            // };

            // setUser(userData); 

            closeAuthModal();
            setError("");
            toast.success("Login Succeeded！");
            router.push("/home");
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
                setError(data.error || "Register Failed");
            } else {
                // auto login
                const signInRes = await signIn("credentials", {
                    redirect: false,
                    email: registerEmail,
                    password: registerPassword,
                });

                if (signInRes?.error) {
                    setError(signInRes.error);
                } else {
                    closeAuthModal();
                    setError("");
                    toast.success("Register and Login Succeeded！");
                    router.push("/home");
                }
            }
        } catch (err) {
            setError("An error occurred during registration");
        }
    };

    const switchMode = () => {
        if (mode === "login") {
            openAuthModal("register");
        } else {
            openAuthModal("login");
        }
        setError("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={closeAuthModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "login" ? "Login" : "Sign Up"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "login"
                            ? "Enter your email and password to login."
                            : "Create a new account by filling out the information below."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && <p className="text-red-500">{error}</p>}
                    {mode === "register" && (
                        <Input
                            id="register-name"
                            placeholder="Name"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                        />
                    )}
                    <Input
                        id={mode === "login" ? "login-email" : "register-email"}
                        placeholder="Email"
                        value={mode === "login" ? loginEmail : registerEmail}
                        onChange={(e) =>
                            mode === "login"
                                ? setLoginEmail(e.target.value)
                                : setRegisterEmail(e.target.value)
                        }
                    />
                    <Input
                        id={
                            mode === "login"
                                ? "login-password"
                                : "register-password"
                        }
                        type="password"
                        placeholder="Password"
                        value={
                            mode === "login" ? loginPassword : registerPassword
                        }
                        onChange={(e) =>
                            mode === "login"
                                ? setLoginPassword(e.target.value)
                                : setRegisterPassword(e.target.value)
                        }
                    />
                    {mode === "register" && (
                        <Input
                            id="register-password-confirm"
                            type="password"
                            placeholder="Confirm Password"
                            // to add password confimation logic
                        />
                    )}
                    <Button
                        onClick={
                            mode === "login" ? handleLogin : handleRegister
                        }
                    >
                        {mode === "login" ? "Login" : "Sign Up"}
                    </Button>
                    <Button variant="outline" onClick={switchMode}>
                        {mode === "login"
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Login"}
                    </Button>
                    {mode === "login" && (
                        <Button
                            variant="outline"
                            onClick={() => signIn("spotify")}
                        >
                            Login with Spotify
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
