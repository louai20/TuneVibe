"use client";

import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type AuthMode = "login" | "register";

interface AuthFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const AuthModal: React.FC = () => {
    const {
        authModal: { isOpen, mode },
        closeAuthModal,
        setError,
        error,
    } = useStore();
    const router = useRouter();

    const isLogin = mode === "login";

    const validationSchema = Yup.object({
        name: isLogin ? Yup.string() : Yup.string().required("Name is required"),
        email: Yup.string()
            .email("Please enter a valid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: isLogin
            ? Yup.string()
            : Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm Password is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<AuthFormValues>({
        resolver: yupResolver(validationSchema) as Resolver<AuthFormValues>,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setError("");
        }
    }, [isOpen, reset, setError]);

    const onSubmit: SubmitHandler<AuthFormValues> = async (data) => {
        if (isLogin) {
            await handleLogin(data);
        } else {
            await handleRegister(data);
        }
    };

    const handleLogin = async (data: AuthFormValues) => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.error) {
                setError(res.error);
                toast.error(res.error);
            } else {
                toast.success("Logged in successfully!");
                closeAuthModal();
                router.push("/home");
            }
        } catch (err) {
            console.error(err);
            setError("Login Failed");
        }
    };

    const handleRegister = async (data: AuthFormValues) => {
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Register Failed");
                toast.error(result.error || "Register Failed");
            } else {
                const signInRes = await signIn("credentials", {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                });

                if (signInRes?.error) {
                    setError(signInRes.error);
                    toast.error(signInRes.error);
                } else {
                    toast.success("Registered and logged in successfully!");
                    closeAuthModal();
                    router.push("/home");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Register Failed");
            toast.error("Register Failed");
        }
    };

    const switchMode = () => {
        useStore.setState({
            authModal: {
                isOpen: true,
                mode: isLogin ? "register" : "login",
            },
        });
        reset();
        setError("");
    };

    if (!isOpen || !mode) return null;

    return (
        <Dialog open={isOpen} onOpenChange={closeAuthModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
                    <DialogDescription>
                        {isLogin ? "Please enter your login credentials." : "Please enter your registration details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Name"
                                {...register("name")}
                                autoComplete="name"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            autoComplete="email"
                        />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            autoComplete="current-password"
                        />
                        {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                {...register("confirmPassword")}
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>}
                        </div>
                    )}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isLogin ? "Login" : "Sign Up"}
                    </Button>
                    <Button variant="outline" type="button" onClick={switchMode} className="w-full">
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
