import React, { useState, useEffect } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";

interface OnlineUser {
  userId: string;
  username: string;
}
interface OnlineUsersListProps {
  notification: string;
}

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ notification }) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    fetchOnlineUsers();
  }, [notification]);

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
      }
    } catch (err) {
      console.log(err);
    }
  };

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
