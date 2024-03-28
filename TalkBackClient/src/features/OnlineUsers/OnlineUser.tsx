import React, { useState, useContext } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatIcon from "@mui/icons-material/Chat";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GameInviting from "./GameInviting";
import { useHttpClient } from "../../hooks/useHttp";
import { AuthContext } from "../../context/auth-context";
import { onlineUsersSocket } from "../../utils/socketConnection";

interface OnlineUserProps {
  username: string;
  onChat: () => void;
}

const OnlineUser: React.FC<OnlineUserProps> = ({ username, onChat }) => {
  const { sendRequest } = useHttpClient();
  const [openGameInvitingModal, setOpenGameInvitingModal] = useState(false);

  const auth = useContext(AuthContext);

  const openGameInviting = () => {
    sendGameInviting();
    setOpenGameInvitingModal(true);
  };

  const closeGameInviting = () => {
    setOpenGameInvitingModal(false);
    onlineUsersSocket.emit("invite-canceled", username);
  };

  const sendGameInviting = async () => {
    try {
      await sendRequest(
        `http://localhost:3004/api/users/online/game-invite`,
        "POST",
        { from: auth.username, to: username }
      );
      console.log("Invite sent");
      // Optionally handle the response, like opening a notification
    } catch (err) {
      console.error(err);
      // Optionally handle the error, like showing an error message
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
    </>
  );
};

export default OnlineUser;
