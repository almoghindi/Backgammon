import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatIcon from "@mui/icons-material/Chat";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface OnlineUserProps {
  username: string;
  onChat: () => void;
  onPlay: () => void;
}

const OnlineUser: React.FC<OnlineUserProps> = ({
  username,
  onChat,
  onPlay,
}) => {
  return (
    <ListItem>
      <ListItemIcon>
        <FiberManualRecordIcon sx={{ color: "green" }} />
      </ListItemIcon>
      <ListItemText primary={username} />

      <IconButton edge="end" onClick={onChat}>
        <ChatIcon sx={{ color: "white" }} />
      </IconButton>
      <IconButton edge="end" onClick={onPlay}>
        <PlayArrowIcon sx={{ color: "white" }} />
      </IconButton>
    </ListItem>
  );
};

export default OnlineUser;
