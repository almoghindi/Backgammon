import React, { useState, useEffect, useContext } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
import SlidingChatPanel from "../Chat/SlidingChat/SlidingChat";
// import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { OnlineUser as OnlineUserInterface } from "../../types/OnlineUser";
import { NotificationProps } from "../../types/Notification";
import "./OnlineList.css";

const OnlineUsersList: React.FC<NotificationProps> = ({ notification }) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInterface[]>([]);
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchOnlineUsers();
  }, [notification]);

  const fetchOnlineUsers = async () => {
    try {
      const responseData = await sendRequest<{ [key: string]: string }>(
        `http://localhost:3004/api/users/online`
      );
      if (responseData) {
        const usersArray: OnlineUserInterface[] = Object.entries(
          responseData.onlineUsers
        )
          .map(([userId, username]) => ({
            userId,
            username,
          }))
          .filter((user) => user.userId !== auth.userId); // Filter out the current user
        console.log(usersArray);
        setOnlineUsers(usersArray);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [openChats, setOpenChats] = useState<string>("");

  const handleCloseChat = () => {
    setOpenChats("");
  };
  const openChat = (user: string) => {
    setOpenChats(user);
  };

  // const [activeChats, setActiveChats] = useState<string[]>([]);

  // function openChatWindow(user: string) {
  //   if (activeChats.includes(user)) return;
  //   setActiveChats((prev) => [...prev, user]);
  // }

  // function closeChatWindow(user: string) {
  //   setActiveChats((prev) => prev.filter((u) => u !== user));
  // }

  return (
    <>
      {/* {isLoading && <LoadingSpinner />} */}
      <List sx={{ width: "100%" }} subheader={<li />}>
        <ListSubheader sx={{ zIndex: -1 }}>Online</ListSubheader>
        {onlineUsers &&
          onlineUsers.map((user) => (
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
