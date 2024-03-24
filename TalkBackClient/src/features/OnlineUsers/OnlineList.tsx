import React, { useState, useEffect, useContext } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
// import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { OnlineUsersContext } from "../../context/online-users-context";
import { OnlineUser as OnlineUserInterface } from "../../types/OnlineUser";
import { NotificationProps } from "../../types/Notification";
import ChatWindow from "../Chat/ChatWindow";
import { v4 as uuidv4 } from "uuid";
import "./OnlineList.css";

const OnlineUsersList: React.FC<NotificationProps> = ({ notification }) => {
  // const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { sendRequest } = useHttpClient();
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

  const [onlineUsersList, setOnlineUsersList] = useState<OnlineUserInterface[]>(
    []
  );
  const { onlineUsers } = useContext(OnlineUsersContext);
  useEffect(() => {
    fetchOnlineUsers();
  }, [onlineUsers, notification]);

  const [activeChats, setActiveChats] = useState<string[]>([]);

  function openChatWindow(user: string) {
    if (activeChats.includes(user)) return;
    setActiveChats((prev) => [...prev, user]);
  }

  function closeChatWindow(user: string) {
    setActiveChats((prev) => prev.filter((u) => u !== user));
  }

  const fetchOnlineUsers = async () => {
    try {
      const responseData = await sendRequest<{
        onlineUsers: OnlineUserInterface[];
      }>(`http://localhost:3004/api/users/online`);

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
        <ListSubheader>Online</ListSubheader>
        {onlineUsersList &&
          onlineUsersList.map((user) => (
            <OnlineUser
              key={user.userId}
              username={user.username}
              onChat={() => {
                openChatWindow(user.username);
              }}
              onPlay={() => {}}
            />
          ))}
      </List>
      {activeChats &&
        activeChats.map((user) => (
          <div key={uuidv4()} className="chat-window">
            <ChatWindow
              chatBuddyUsername={user}
              onCloseWindow={closeChatWindow}
            />
          </div>
        ))}
    </>
  );
};
export default OnlineUsersList;
