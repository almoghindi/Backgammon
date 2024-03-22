import React, { useState } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";
import Notification from "../features/OnlineUsers/Notification";
const HomePage: React.FC = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const handleNotification = (message: string) => {
    setNotificationMessage(message);
  };

  return (
    <>
      <NavBar />
      <Notification onNotification={handleNotification} />
      <OnlineList notification={notificationMessage} />
      <OfflineList notification={notificationMessage} />
      <Footer />
    </>
  );
};

export default HomePage;
