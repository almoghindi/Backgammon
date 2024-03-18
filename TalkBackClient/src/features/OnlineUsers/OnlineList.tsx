import React from "react";
import { List, ListSubheader } from "@mui/material";
import OnlineUser from "./OnlineUser";

interface OnlineUsersListProps {
  onlineUsers: Array<{ username: string }>;
}

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ onlineUsers }) => {
  return (
    <List sx={{ width: "100%" }} subheader={<li />}>
      <ListSubheader>Online</ListSubheader>
      {onlineUsers.map((user) => (
        <OnlineUser
          key={user.username}
          username={user.username}
          onChat={() => {}}
          onPlay={() => {}}
        />
      ))}
    </List>
  );
};
export default OnlineUsersList;
