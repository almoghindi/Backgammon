import React, { useState, useContext, useEffect } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";
import Notification from "../features/OnlineUsers/Notification";
import { AuthContext } from "../context/auth-context";
import { Container, Typography } from "@mui/material";
import { onlineUsersSocket } from "../utils/socketConnection";
import UserDetails from "../features/UserDetails/userDetails";
const HomePage: React.FC = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [openChat, setOpenChat] = useState("");
  const { username } = useContext(AuthContext);
  const handleNotification = (message: string) => {
    setNotificationMessage(message);
  };
  const handleOpenChat = (user: string) => {
    setOpenChat(user);
  };

  useEffect(() => {
    if (!username) return;
    onlineUsersSocket.emit("user-logged-in", username);
    onlineUsersSocket.emit("user-online", username);
  }, [username]);

  return (
    <>
      <NavBar />
      <Notification
        onNotification={handleNotification}
        userWithOpenChat={openChat}
      />
      <Container
        sx={{
          display: "flex",
          width: "100vw",
          padding: "0",
          marginTop: "2%",
          overflowY: "auto",
        }}
      >
        <UserDetails username={username} />
        <Container>
          <Typography variant="h5" align="left" gutterBottom>
            Users
          </Typography>
          <OnlineList
            notification={notificationMessage}
            onChatOpen={handleOpenChat}
          />
          <OfflineList notification={notificationMessage} />
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
