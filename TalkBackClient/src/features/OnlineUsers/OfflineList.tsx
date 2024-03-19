import React from "react";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
interface UserListProps {
  offlineUsers: Array<{ username: string }>;
}

const OnlineUsersList: React.FC<UserListProps> = ({ offlineUsers }) => {
  return (
    <List sx={{ width: "100%" }} subheader={<li />}>
      <ListSubheader>Offline</ListSubheader>
      {offlineUsers.map((user) => (
        <ListItem key={user.username}>
          <ListItemIcon>
            <FiberManualRecordIcon sx={{ color: "grey" }} />
          </ListItemIcon>
          <ListItemText primary={user.username} />
        </ListItem>
      ))}
    </List>
  );
};
export default OnlineUsersList;
