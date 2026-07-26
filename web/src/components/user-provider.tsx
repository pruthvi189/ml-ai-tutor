"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  userId: number;
  name: string;
  email: string;
}

const UserContext = createContext<User | null>(null);

export function UserProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  useEffect(() => {
    if (initialUser === undefined) {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((data) => setUser(data.user))
        .catch(() => {});
    }
  }, [initialUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
