import React, { useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { AuthContext } from "../context/auth-context";
import logo from "../assets/logo.png";

const NavBar: React.FC = () => {
  const handleLogout = () => {
    localStorage.setItem("userName", auth.username);
    auth.logout();
  };
  const auth = useContext(AuthContext);
  return (
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
  );
};

export default NavBar;
