import React, { useState, useEffect } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import io from "socket.io-client";
const socket = io("http://localhost:3004");

interface OnlineUser {
  userId: string;
  username: string;
}
const OnlineUsersList: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();

  const joinRoom = () => {
    socket.emit("joinRoom");
  };

  socket.on("userJoined", (message) => {
    console.log(message);
  });

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const responseData = await sendRequest<{ [key: string]: string }>(
          `http://localhost:3004/api/users/online`
        );
        if (responseData) {
          const usersArray: OnlineUser[] = Object.entries(
            responseData.onlineUsers
          ).map(([userId, username]) => ({
            userId,
            username,
          }));
          setOnlineUsers(usersArray);
          joinRoom();
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchOnlineUsers();
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <List sx={{ width: "100%" }} subheader={<li />}>
        <ListSubheader>Online</ListSubheader>
        {onlineUsers &&
          onlineUsers.map((user) => (
            <OnlineUser
              key={user.userId}
              username={user.username}
              onChat={() => {}}
              onPlay={() => {}}
            />
          ))}
      </List>
    </>
  );
};
export default OnlineUsersList;
