import React, { useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useHttpClient } from "../hooks/useHttp";
import { AuthContext } from "../context/auth-context";
import logo from "../assets/logo2.png";
import LoadingSpinner from "../components/LoadingSpinner";
import { onlineUsersSocket as socket } from "../utils/socketConnection";

const NavBar: React.FC = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await sendRequest(`http://localhost:3004/api/users/offline`, "POST", {
        userId: auth.userId,
        username: auth.username,
      });
      localStorage.setItem("userName", auth.username);
      auth.logout();
      socket.emit("user-logged-out", auth.username);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <AppBar position="static" sx={{ backgroundColor: `#7EA8BE` }}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ maxWidth: 60, margin: "1em" }} />
          <div style={{ flexGrow: 1, color: "#F6F0ED" }}>
            <Typography variant="h5">Talkback</Typography>
            <Typography>Online backgammon</Typography>
          </div>
          <IconButton color="inherit" onClick={handleLogout}>
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
