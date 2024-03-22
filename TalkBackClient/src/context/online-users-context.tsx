import { createContext } from "react";

interface OnlineUser {
  userId: string;
  username: string;
}

interface OnlineUsersContextType {
  onlineUsers: OnlineUser[];
  addOnlineUser: (userId: string, username: string) => void;
  removeOnlineUser: (userId: string, username: string) => void;
}

const defaultState: OnlineUsersContextType = {
  onlineUsers: [],
  addOnlineUser: () => {},
  removeOnlineUser: () => {},
};
export const OnlineUsersContext =
  createContext<OnlineUsersContextType>(defaultState);
