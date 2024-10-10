"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useStore from "@/store/useStore";

const SessionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        if (status === "authenticated" && session.user) {
            setUser({
                id: session.user.id as string,
                name: session.user.name as string,
                email: session.user.email as string,
            });
        } else {
            setUser(null);
        }
    }, [status, session, setUser]);

    return <>{children}</>;
};

export default SessionProviderWrapper;
