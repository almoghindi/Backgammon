import React, { useState, useContext, useEffect } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";
import Notification from "../features/OnlineUsers/Notification";
import { AuthContext } from "../context/auth-context";
import { Typography } from "@mui/material";
import { onlineUsersSocket } from "../utils/socketConnection";
const HomePage: React.FC = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const { username } = useContext(AuthContext);
  const handleNotification = (message: string) => {
    setNotificationMessage(message);
  };

  useEffect(() => {
    if (!username) return;
    onlineUsersSocket.emit("user-logged-in", username);
    onlineUsersSocket.emit("user-online", username);
  }, [username]);

  return (
    <>
      <NavBar />
      <Typography textAlign={"center"}>Playing as: {username}</Typography>
      <Notification onNotification={handleNotification} />
      <OnlineList notification={notificationMessage} />
      <OfflineList notification={notificationMessage} />
      <Footer />
    </>
  );
};

export default HomePage;
