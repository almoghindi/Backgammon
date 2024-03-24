import React, { useState, useEffect, useContext } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
import { AuthContext } from "../../context/auth-context";
import { OnlineUsersContext } from "../../context/online-users-context";
import SlidingChatPanel from "../Chat/SlidingChat/SlidingChat";

interface OnlineUser {
  userId: string;
  username: string;
}
interface OnlineUsersListProps {
  notification: string;
}

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ notification }) => {
  // const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  // useEffect(() => {
  //   fetchOnlineUsers();
  // }, [notification]);

  // const fetchOnlineUsers = async () => {
  //   try {
  //     const responseData = await sendRequest<{ [key: string]: string }>(
  //       `http://localhost:3004/api/users/online`
  //     );
  //     if (responseData) {
  //       const usersArray: OnlineUser[] = Object.entries(
  //         responseData.onlineUsers
  //       )
  //         .map(([userId, username]) => ({
  //           userId,
  //           username,
  //         }))
  //         .filter((user) => user.userId !== auth.userId); // Filter out the current user
  //       setOnlineUsers(usersArray);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   setOnlineUsers((prev) => prev.filter((user) => user.userId == auth.userId));
  // }, [onlineUsers]);
  const [openChats, setOpenChats] = useState<string>("");

  const handleCloseChat = () => {
    setOpenChats("");
  };
  const openChat = (user: string) => {
    setOpenChats(user);
  };

  const [onlineUsersList, setOnlineUsersList] = useState<OnlineUser[]>([]);
  const { onlineUsers } = useContext(OnlineUsersContext);
  useEffect(() => {
    fetchOfflineUsers();
  }, [onlineUsers, notification]);

  const fetchOfflineUsers = async () => {
    try {
      const responseData = await sendRequest<{ onlineUsers: OnlineUser[] }>(
        `http://localhost:3004/api/users/online`
      );

      setOnlineUsersList(responseData.onlineUsers);
      setOnlineUsersList((prev) =>
        (prev || []).filter((user) => user.userId !== auth.userId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* {isLoading && <LoadingSpinner />} */}
      <List sx={{ width: "100%" }} subheader={<li />}>
        <ListSubheader sx={{ zIndex: -1 }}>Online</ListSubheader>
        {onlineUsersList &&
          onlineUsersList.map((user) => (
            <OnlineUser
              key={user.userId}
              username={user.username}
              onChat={() => {
                openChat(user.username);
              }}
              onPlay={() => {}}
            />
          ))}
      </List>
      <SlidingChatPanel
        isOpen={openChats !== ""}
        openChat={openChats}
        setIsOpen={handleCloseChat}
      />
      {/* {openChats &&
        openChats.map((user) => (
          <div key={user} style={{ width: "50%" }}>
            <ChatWindow
              chatBuddyUsername={user}
              onCloseWindow={() => closeChat(user)}
            />
          </div>
        ))} */}
    </>
  );
};
export default OnlineUsersList;
