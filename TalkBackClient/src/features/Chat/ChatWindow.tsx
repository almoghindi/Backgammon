import { useContext, useEffect, useState } from "react";
import { socket } from "../../socket/chatSocket.ts";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Typography } from "@mui/material";
import ChatInput from "../../components/Chat/ChatInput/ChatInput.tsx";
import MessageModel from "../../components/Chat/models/MessageModel.ts";
import ChatMessagesBlock from "../../components/Chat/ChatMessagesBlock/ChatMessagesBlock";
import { useHttpClient } from "../../hooks/useHttp.tsx";

interface UserData {
  username: string;
  socketId: string;
}

interface Props {
  chatBuddyUsername: string;
}

export default function ChatWindow(props: Props) {
  const { chatBuddyUsername } = props;
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auth = useContext(AuthContext);
  const { username, token } = auth;
  const { sendRequest } = useHttpClient();

  const addMessage = (message: MessageModel) => {
    setMessages((prev) => [...prev, message]);
  };
  function handleUserMesssage(
    sender: string,
    content: string,
    timestamp: Date
  ) {
    const newMessage = new MessageModel(
      sender,
      content,
      timestamp.toLocaleTimeString()
    );
    addMessage(newMessage);
    sendNewMessage(newMessage);
    // socket.emit("send-message", { message: newMessage, to: chatBuddyUsername });
  }
  function handleIncomingMessage(messageJson: MessageModel) {
    const message = messageJson;
    addMessage(message);
  }
  async function sendNewMessage(newMessage: MessageModel) {
    ///new-message
    try {
      const response = await sendRequest(
        `http://localhost:3002/api/chat/new-message`,
        "POST",
        { message: newMessage, to: chatBuddyUsername },
        { authorization: `Bearer ${token}` }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  async function askToEnterChat(data: UserData) {
    ///new-message
    try {
      const response = await sendRequest(
        `http://localhost:3002/api/chat/enter-chat`,
        "POST",
        { data, to: chatBuddyUsername },
        { authorization: `Bearer ${token}` }
      );
      if (!response) throw new Error("enter chat failed");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    function onConnect(sender: string) {
      setIsLoading(false);
      console.log(sender);
      const name = username === sender ? "You" : sender;
      const newMessage = new MessageModel(
        "admin",
        `${name} connected`,
        new Date().toLocaleTimeString()
      );
      addMessage(newMessage);
    }
    function onMount() {
      if (!username) return;
      const data = {
        username: username,
        socketId: socket.id === undefined ? "" : socket.id,
      };
      askToEnterChat(data);
      onConnect(data.username);
    }
    onMount();
    socket.on("user-joined", onConnect);
    socket.on("new-message", handleIncomingMessage);
    return () => {
      socket.off("user-joined", onConnect);
      socket.off("new-message", handleIncomingMessage);
    };
  }, [username]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Typography textAlign={"center"}>{chatBuddyUsername}</Typography>
      <ChatMessagesBlock messages={messages} username={username} />
      <ChatInput
        addMessage={(content, timestamp) =>
          handleUserMesssage(username, content, timestamp)
        }
      />
    </>
  );
}
