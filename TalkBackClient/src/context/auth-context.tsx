import { createContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string;
  token: string;
  username: string;
  login: (
    uid: string,
    token: string,
    refreshToken: string,
    username: string
  ) => void;
  logout: () => void;
}

// Providing a default context value matching the interface
const defaultState: AuthContextType = {
  isLoggedIn: false,
  userId: "",
  token: "",
  username: "",
  login: () => {},
  logout: () => {},
};
export const AuthContext = createContext<AuthContextType>(defaultState);
