import React, { useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useHttpClient } from "../hooks/useHttp";
import { AuthContext } from "../context/auth-context";
import logo from "../assets/logo.png";
import LoadingSpinner from "../components/LoadingSpinner";
import { socket } from "../utils/socketConnection";
import { OnlineUsersContext } from "../context/online-users-context";

const NavBar: React.FC = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const { removeOnlineUser } = useContext(OnlineUsersContext);
  const handleLogout = async () => {
    try {
      await sendRequest(
        `http://localhost:3004/api/users/changeStatus`,
        "POST",
        {
          userId: auth.userId,
          username: auth.username,
          status: "offline",
        }
      );
      removeOnlineUser(auth.userId, auth.username);
      localStorage.setItem("userName", auth.username);
      socket.emit("user-logged-out", auth.username);
      auth.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="Logo" style={{ maxWidth: 100 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: "orange" }}>
            Backgammon
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
