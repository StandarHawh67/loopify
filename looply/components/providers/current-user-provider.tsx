"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { SessionUser } from "@/types";

type CurrentUserContextValue = {
  currentUser: SessionUser;
  setCurrentUser: (user: SessionUser) => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({
  initialUser,
  children
}: {
  initialUser: SessionUser;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState(initialUser);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser
    }),
    [currentUser]
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }

  return context;
}
