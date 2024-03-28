import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../context/auth-context";
import { OnlineUser } from "../../types/OnlineUser";
import { NotificationProps } from "../../types/Notification";

const OnlineUsersList: React.FC<NotificationProps> = ({ notification }) => {
  const [offlineUsers, setOfflineUsers] = useState<OnlineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    fetchOfflineUsers();
  }, [notification]);

  const fetchOfflineUsers = async () => {
    try {
      const responseData = await sendRequest<{ offlineUsers: OnlineUser[] }>(
        `http://localhost:3004/api/users/offline`
      );

      setOfflineUsers(responseData.offlineUsers);
      setOfflineUsers((prev) =>
        (prev || []).filter((user) => user.userId !== auth.userId)
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <List sx={{ width: "100%", zIndex: -1 }} subheader={<li />}>
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
