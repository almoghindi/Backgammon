import React from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";

const HomePage: React.FC = () => {
  // Dummy data, replace with actual data
  const onlineUsers = [
    { username: "user1", isOnline: true },
    { username: "user2", isOnline: true },
    { username: "user3", isOnline: true },
  ];

  const offlineUsers = [
    { username: "user4", isOnline: false },
    { username: "user5", isOnline: false },
    { username: "user6", isOnline: false },
  ];

  return (
    <>
      <NavBar />
      <OnlineList onlineUsers={onlineUsers} />
      <OfflineList offlineUsers={offlineUsers} />
      <Footer />
    </>
  );
};

export default HomePage;
