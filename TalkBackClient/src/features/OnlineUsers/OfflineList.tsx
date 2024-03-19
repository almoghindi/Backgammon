import React, { useState, useEffect } from "react";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";

interface OfflineUser {
  userId: string;
  username: string;
}

const OnlineUsersList: React.FC = () => {
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  useEffect(() => {
    const fetchOfflineUsers = async () => {
      try {
        const responseData = await sendRequest<{ offlineUsers: OfflineUser[] }>(
          `http://localhost:3004/api/users/offline`
        );

        setOfflineUsers(responseData.offlineUsers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfflineUsers();
  }, []);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <List sx={{ width: "100%" }} subheader={<li />}>
        <ListSubheader>Offline</ListSubheader>
        {offlineUsers.map((user) => (
          <ListItem key={user.userId}>
            <ListItemIcon>
              <FiberManualRecordIcon sx={{ color: "grey" }} />
            </ListItemIcon>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
export default OnlineUsersList;
