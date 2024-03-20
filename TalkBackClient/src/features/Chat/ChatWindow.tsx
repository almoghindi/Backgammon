import { useCallback, useContext, useEffect, useState } from "react";
import { socket } from "../../socket/chatSocket.ts";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner.js";

class MessageModel {
  constructor(sender: string, content: string) {
    this.sender = sender;
    this.content = content;
    this.timestamp = new Date();
  }
  sender: string;
  content: string;
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const addMessage = useCallback((sender: string, content: string) => {
    const newMessage = new MessageModel(sender, content);
    console.log(newMessage);
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    function onConnect() {
      console.log("client token" + auth.token);
      socket.emit("authorize-token", auth.token);
    }
    function onAuthorizationResult(resultobject: { authorization: boolean }) {
      if (!resultobject.authorization) {
        alert("User unauthorized");
        navigate("/");
        return;
      }
      console.log("authorized");
      setIsLoading(false);
      addMessage("admin", `${auth.username} connected`);
    }

    socket.on("user-connected", onConnect);
    socket.on("authorization-result", onAuthorizationResult);
    return () => {
      socket.off("user-connected", onConnect);
      socket.on("authorization-result", onAuthorizationResult);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {messages && messages.map((m) => <p>{m.content}</p>)}
    </>
  );
}
