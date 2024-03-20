import React, { useState } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";
import Notification from "../features/OnlineUsers/Notification";
const HomePage: React.FC = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const handleOnlineNotification = (message: string) => {
    setNotificationMessage(message);
    console.log(message);
  };

  const handleOfflineNotification = (message: string) => {
    console.log(message);
    setNotificationMessage(message);
  };

  return (
    <>
      <NavBar onOfflineNotification={handleOfflineNotification} />
      <Notification onOnlineNotification={handleOnlineNotification} />
      <OnlineList notification={notificationMessage} />
      <OfflineList notification={notificationMessage} />
      <Footer />
    </>
  );
};

export default HomePage;
