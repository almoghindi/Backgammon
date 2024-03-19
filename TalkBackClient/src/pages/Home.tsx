import React from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import OnlineList from "../features/OnlineUsers/OnlineList";
import OfflineList from "../features/OnlineUsers/OfflineList";

const HomePage: React.FC = () => {
  return (
    <>
      <NavBar />
      <OnlineList />
      <OfflineList />
      <Footer />
    </>
  );
};

export default HomePage;
