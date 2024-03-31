import React, { useState, useEffect, useContext } from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";
import { useHttpClient } from "../../hooks/useHttp";
import SlidingChatPanel from "../Chat/SlidingChat/SlidingChat";
// import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { OnlineUser as OnlineUserInterface } from "../../types/OnlineUser";
// import { NotificationProps } from "../../types/Notification";
import GameInvited from "./GameInvited";
import { onlineUsersSocket } from "../../utils/socketConnection";

import "./OnlineList.css";

interface OnlineUsersList {
  notification: string;
  onChatOpen: (message: string) => void;
}

const OnlineUsersList: React.FC<OnlineUsersList> = ({
  notification,
  onChatOpen,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInterface[]>([]);
  useState<boolean>(false);
  const [openGameInvitedModal, setOpenGameInvitedModal] = useState(false);
  const [fromUsername, setFromUsername] = useState<string>("");
  const [messageFrom, setMessageFrom] = useState("");
  
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const openGameInvited = () => {
    setOpenGameInvitedModal(true);
  };

  const closeGameInvited = () => {
    setOpenGameInvitedModal(false);
    onlineUsersSocket.emit("invite-declined", fromUsername);
  };

  const handleAcceptGame = () => {
    onlineUsersSocket.emit("invite-accepted", fromUsername);
    window.open(`http://localhost:5174/game/${auth.username}&${fromUsername}?token=${auth.token}`);
    setOpenGameInvitedModal(false);
  };

  useEffect(() => {
    fetchOnlineUsers();

    const messageRegex = /^(.+) sent you a message$/;
    let match = notification.match(messageRegex);

    if (match) {
      setMessageFrom(match[1]);
    }

  }, [notification]);

  useEffect(() => {
    onlineUsersSocket.on("game-invite", (from: string) => {
      openGameInvited();
      setFromUsername(from);
    });

    onlineUsersSocket.on("cancel-invite", () => {
      setOpenGameInvitedModal(false);
    });

    return () => {
      onlineUsersSocket.off("game-invite");
      onlineUsersSocket.off("cancel-invite");
    };
  }, []);

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
        setOnlineUsers(usersArray);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [openChats, setOpenChats] = useState<string>("");

  const handleCloseChat = () => {
    setOpenChats("");
    onChatOpen("");
  };
  const openChat = (user: string) => {
    setOpenChats(user);
    onChatOpen(user);
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
      <GameInvited
        open={openGameInvitedModal}
        onClose={closeGameInvited}
        onAccept={handleAcceptGame}
        username={fromUsername}
      />
    </>
  );
};
export default OnlineUsersList;
