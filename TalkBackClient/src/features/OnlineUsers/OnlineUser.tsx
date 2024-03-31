import React, { useState, useContext, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  // Badge,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatIcon from "@mui/icons-material/Chat";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GameInviting from "./GameInviting";
import { useHttpClient } from "../../hooks/useHttp";
import { AuthContext } from "../../context/auth-context";
import { onlineUsersSocket } from "../../utils/socketConnection";
import Snackbar from "../../components/Snackbar";
interface OnlineUserProps {
  username: string;
  onChat: () => void;
  openChat: string;
  
}

const OnlineUser: React.FC<OnlineUserProps> = ({ username, onChat }) => {
  const { sendRequest } = useHttpClient();
  const [openGameInvitingModal, setOpenGameInvitingModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const auth = useContext(AuthContext);

  const openGameInviting = () => {
    sendGameInviting();
    setOpenGameInvitingModal(true);
  };

  const closeGameInviting = () => {
    setOpenGameInvitingModal(false);
    onlineUsersSocket.emit("invite-canceled", username);
  };

  useEffect(() => {
    onlineUsersSocket.on("decline-invite", () => {
      setOpenGameInvitingModal(false);
      setOpenSnackbar(true);
    });

    onlineUsersSocket.on("accept-invite", () => {
      setOpenGameInvitingModal(false);
      window.open(`http://localhost:5174/game/${auth.username}&${username}`);
    });

    return () => {
      onlineUsersSocket.off("decline-invite");
      onlineUsersSocket.off("accept-invite");
    };
  }, []);

  const sendGameInviting = async () => {
    try {
      await sendRequest(
        `http://localhost:3004/api/users/online/game-invite`,
        "POST",
        { from: auth.username, to: username }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FiberManualRecordIcon sx={{ color: "green" }} />
        </ListItemIcon>
        <ListItemText primary={username} />
        <IconButton edge="end" onClick={onChat}>
          <ChatIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton edge="end" onClick={openGameInviting}>
          <PlayArrowIcon sx={{ color: "white" }} />
        </IconButton>
      </ListItem>
      <GameInviting
        open={openGameInvitingModal}
        onClose={closeGameInviting}
        username={username}
      />
      <Snackbar
        snackbarOpen={openSnackbar}
        setSnackbarOpen={setOpenSnackbar}
        snackbarMessage={`Invite declined by ${username}`}
        severity="error"
      />
    </>
  );
};

export default OnlineUser;
