import { useState, useEffect } from "react";
import { onlineUsersSocket as socket } from "../../utils/socketConnection";
import Snackbar from "../../components/Snackbar";

interface NotificationProps {
  onNotification: (message: string) => void;
}

const OnlineUserNotification: React.FC<NotificationProps> = ({
  onNotification,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  useEffect(() => {
    socket.on("user-joined", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setOnlineStatus(true);
    });
    socket.on("user-left", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setOnlineStatus(false);
    });
    return () => {
      if (onlineStatus) {
        socket.off("user-joined");
      } else {
        socket.off("user-left");
      }
    };
  }, []);

  useEffect(() => {
    onNotification(snackbarMessage);
  }, [snackbarMessage, onNotification]);

  return (
    <>
      <Snackbar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarMessage={snackbarMessage}
        variant={onlineStatus ? "success" : "error"}
      />
    </>
  );
};

export default OnlineUserNotification;
