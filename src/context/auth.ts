import { createContext } from "react";

// グローバルで扱う変数・関数（contextで管理）
export const AuthContext = createContext(
  {} as {
    loading: boolean;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);
