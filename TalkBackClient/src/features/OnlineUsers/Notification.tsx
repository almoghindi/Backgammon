import {
  useState,
  useEffect,
  // useContext
} from "react";
import { onlineUsersSocket as socket } from "../../utils/socketConnection";
// import { AuthContext } from "../../context/auth-context";
import Snackbar from "../../components/Snackbar";
//import { useHttpClient } from "../../hooks/useHttp";
import notificationSound from "../../assets/message-sound.mp3";
interface NotificationProps {
  onNotification: (message: string) => void;
  userWithOpenChat: string;
}

const Notification: React.FC<NotificationProps> = ({
  onNotification,
  userWithOpenChat,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [playMessageSound, setPlayMessageSound] = useState(false);
  // const { sendRequest } = useHttpClient();
  // const auth = useContext(AuthContext);
  useEffect(() => {
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "hidden") {
    //     socket.emit("user-logged-out", auth.username);
    //     handleLeaveAndEnterScreen("offline");
    //   } else {
    //     socket.emit("user-logged-in", auth.username);
    //     handleLeaveAndEnterScreen("online");
    //   }
    // };

    // const handleLeaveAndEnterScreen = async (mode: "offline" | "online") => {
    //   await sendRequest(`http://localhost:3004/api/users/${mode}`, "POST", {
    //     userId: auth.userId,
    //     username: auth.username,
    //   });
    // };

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

    //document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (onlineStatus) {
        socket.off("user-joined");
      } else {
        socket.off("user-left");
      }

      //document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    socket.on("push-message", (message: string) => {
      const messageRegex = /^(.+) sent you a message$/;

      const match = message.match(messageRegex);
      let username = "";
      if (match) {
        username = match[1];
      }

      if (!userWithOpenChat && userWithOpenChat != username) {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
        setOnlineStatus(true);
        setSnackbarSeverity("info");
        setPlayMessageSound(true);
      }
    });

    return () => {
      socket.off("push-message");
    };
  }, [userWithOpenChat]);

  useEffect(() => {
    onNotification(snackbarMessage);
  }, [snackbarMessage, onNotification]);

  useEffect(() => {
    if (playMessageSound) {
      // Create an Audio object with the notification sound file
      const audio = new Audio(notificationSound);
      // Play the audio
      audio.play();
      // Set playMessageSound back to false to prevent continuous playing
      setPlayMessageSound(false);
    }
  }, [playMessageSound]);

  return (
    <>
      {/* <ReactPlayer
        url="https://youtu.be/_d4igG5uZ28?si=X8TSrUsfuA0NivLW"
        playing={playMessageSound}
        width="0"
        height="0"
      /> */}
      <Snackbar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarMessage={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default Notification;
