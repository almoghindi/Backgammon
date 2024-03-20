import { useState, useEffect } from "react";
import { socket } from "../../utils/socketConnection";
import Snackbar from "../../components/Snackbar";

interface NotificationProps {
  onOnlineNotification: (message: string) => void;
}

const OnlineUserNotification: React.FC<NotificationProps> = ({
  onOnlineNotification,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    socket.on("userLoggedIn", (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      console.log(message);
    });

    return () => {
      socket.off("userLoggedIn");
    };
  }, []);

  useEffect(() => {
    onOnlineNotification(snackbarMessage);
    console.log(snackbarMessage);
  }, [snackbarMessage, onOnlineNotification]);

  return (
    <>
      <Snackbar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarMessage={snackbarMessage}
        variant="success"
      />
    </>
  );
};

export default OnlineUserNotification;
