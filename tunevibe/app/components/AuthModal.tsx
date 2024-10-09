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
import useStore from "@/store/useStore";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type AuthMode = "login" | "register";

const AuthModal: React.FC = () => {
  const {
    authModal: { isOpen, mode },
    closeAuthModal,
    openAuthModal,
    setError,
    error,
  } = useStore();

  const router = useRouter();

  if (!isOpen || !mode) return null;

  const switchMode = () => {
    if (mode === "login") {
      openAuthModal("register");
    } else {
      openAuthModal("login");
    }
    setError("");
  };

  const initialValues =
    mode === "login"
      ? {
          email: "",
          password: "",
        }
      : {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Required"),
  });
  

  const handleLogin = async (values: any) => {
    const { email, password } = values;
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      closeAuthModal();
      setError("");
      toast.success("Login Succeeded！");
      router.push("/home");
    }
  };

  const handleRegister = async (values: any) => {
    const { name, email, password } = values;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Register Failed");
      } else {
        // Auto login
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
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
          <Formik
            initialValues={initialValues}
            validationSchema={mode === "login" ? LoginSchema : RegisterSchema}
            onSubmit={mode === "login" ? handleLogin : handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {mode === "register" && (
                  <div>
                    <Field
                      as={Input}
                      id="register-name"
                      name="name"
                      placeholder="Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
                <div>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {mode === "register" && (
                  <div>
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {mode === "login" ? "Login" : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>
          <Button variant="outline" onClick={switchMode}>
            {mode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
          {mode === "login" && (
            <Button variant="outline" onClick={() => signIn("spotify")}>
              Login with Spotify
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
