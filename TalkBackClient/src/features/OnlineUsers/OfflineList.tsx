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
import { OnlineUsersContext } from "../../context/online-users-context";
import { AuthContext } from "../../context/auth-context";

interface OfflineUser {
  userId: string;
  username: string;
}

interface OfflineUsersListProps {
  notification: string;
}

const OnlineUsersList: React.FC<OfflineUsersListProps> = ({ notification }) => {
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const { onlineUsers } = useContext(OnlineUsersContext);
  const auth = useContext(AuthContext);
  useEffect(() => {
    fetchOfflineUsers();
  }, [onlineUsers, notification]);

  const fetchOfflineUsers = async () => {
    try {
      const responseData = await sendRequest<{ offlineUsers: OfflineUser[] }>(
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
