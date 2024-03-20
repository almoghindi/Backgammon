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
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const addMessage = useCallback((sender: string, content: string) => {
    const newMessage = new MessageModel(sender, content);
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    function onConnect() {
      socket.emit("authorize-token", token);
    }
    function onAuthorizationResult(resultobject: { authorization: boolean }) {
      if (!resultobject.authorization) {
        alert("User unauthorized");
        navigate("/");
      }
      setIsLoading(false);
      addMessage("admin", `${username} connected`);
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
