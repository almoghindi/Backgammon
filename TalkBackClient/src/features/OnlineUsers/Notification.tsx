import { useState, useEffect, useContext } from "react";
import { onlineUsersSocket as socket } from "../../utils/socketConnection";
import { OnlineUsersContext } from "../../context/online-users-context";
import { AuthContext } from "../../context/auth-context";
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const auth = useContext(AuthContext);
  const { removeOnlineUser, addOnlineUser } = useContext(OnlineUsersContext);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        removeOnlineUser(auth.userId, auth.username);
        console.log("User left the screen");
        socket.emit("user-logged-out", auth.username);
      } else {
        addOnlineUser(auth.userId, auth.username);
        console.log("User entered the screen");
        socket.emit("user-logged-in", auth.username);
      }
    };

    socket.on("push-message", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setOnlineStatus(true);
      setSnackbarSeverity("info");
    });

    socket.on("user-joined", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setOnlineStatus(true);
      setSnackbarSeverity("success");
    });
    socket.on("user-left", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setOnlineStatus(false);
      setSnackbarSeverity("error");
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

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
        severity={snackbarSeverity}
      />
    </>
  );
};

export default OnlineUserNotification;
