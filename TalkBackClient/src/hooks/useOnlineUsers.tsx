import { useState, useEffect } from "react";
import { useHttpClient } from "./useHttp";
import { OnlineUser } from "../types/OnlineUser";
export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { sendRequest } = useHttpClient();

  const fetchChangeOnlineUser = async (
    userId: string,
    username: string,
    status: string
  ) => {
    await sendRequest("http://localhost:3004/api/users/changeStatus", "POST", {
      userId,
      username,
      status,
    });
  };

  const addOnlineUser = (userId: string, username: string) => {
    fetchChangeOnlineUser(userId, username, "online");
    setOnlineUsers((prevUsers) => [...prevUsers, { userId, username }]);
  };

  const removeOnlineUser = (userId: string, username: string) => {
    fetchChangeOnlineUser(userId, username, "offline");
    setOnlineUsers((prevUsers) =>
      prevUsers.filter((user) => user.userId !== userId)
    );
  };
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      const response = await sendRequest<{
        onlineUsers: OnlineUser[];
      }>("http://localhost:3004/api/users/online");
      setOnlineUsers(
        response.onlineUsers.map((user) => ({
          userId: user.userId,
          username: user.username,
        }))
      );
    };
    fetchOnlineUsers();
  }, []);

  return { onlineUsers, addOnlineUser, removeOnlineUser };
};