import React, { useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useHttpClient } from "../hooks/useHttp";
import { AuthContext } from "../context/auth-context";
import logo from "../assets/logo.png";
import LoadingSpinner from "../components/LoadingSpinner";

const NavBar: React.FC = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const handleLogout = () => {
    sendRequest(`http://localhost:3004/api/users/offline`, "POST", {
      userId: auth.userId,
      username: auth.username,
    });
    localStorage.setItem("userName", auth.username);
    auth.logout();
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
