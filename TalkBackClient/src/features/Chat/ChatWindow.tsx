import { useCallback, useContext, useEffect, useState } from "react";
import { chatSocket as socket } from "../../utils/socketConnection";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Divider, Typography } from "@mui/material";
import ChatInput from "../../components/Chat/ChatInput/ChatInput.tsx";
import MessageModel from "../../types/message.model.tsx";
import ChatMessagesBlock from "../../components/Chat/ChatMessagesBlock/ChatMessagesBlock";
import { useHttpClient } from "../../hooks/useHttp.tsx";
import CloseIcon from "@mui/icons-material/Close";
import "./ChatWindow.css";

interface UserData {
  username: string;
  socketId: string;
}

interface ChatMessagesResponse {
  chatId: string;
  messages: MessageModel[];
}

interface Props {
  chatBuddyUsername: string;
  onCloseWindow: (value: string) => void;
}

export default function ChatWindow(props: Props) {
  const { chatBuddyUsername, onCloseWindow } = props;
  const [messages, setMessages] = useState<MessageModel[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chatId, setChatId] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
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
    const newMessage = new MessageModel(sender, content, timestamp);
    addMessage(newMessage);
    sendNewMessage(newMessage);
    // socket.emit("send-message", { message: newMessage, to: chatBuddyUsername });
  }
  function handleIncomingMessage(messageJson: MessageModel) {
    const message = messageJson;
    addMessage(message);
  }
  const sendNewMessage = useCallback(
    async (newMessage: MessageModel) => {
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
    },
    [token, chatBuddyUsername]
  );

  const askToEnterChat = useCallback(
    async (data: UserData) => {
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
    },
    [token, chatBuddyUsername]
  );

  const fetchMessages = useCallback(async () => {
    try {
      const response = await sendRequest<ChatMessagesResponse>(
        `http://localhost:3002/api/chat/fetchMessages`,
        "POST",
        { sender: username, reciever: chatBuddyUsername },
        { authorization: `Bearer ${token}` }
      );
      if (!response) throw new Error("fetch failed");
      setChatId(response.chatId);
      setMessages(response.messages);
      setIsLoadingMessages(false);
    } catch (err) {
      console.error(err);
    }
  }, [token, username, chatBuddyUsername]);

  useEffect(() => {
    function onConnect(sender: string) {
      const name = username === sender ? "You" : sender;
      const newMessage = new MessageModel(
        "admin",
        `${name} connected`,
        new Date()
      );
      fetchMessages();
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
      socket.disconnect();
    };
  }, [username]);

  return (
    <>
      {isLoadingMessages && <LoadingSpinner />}
      <div className="chat-window-header">
        <Typography>Chat with: {chatBuddyUsername}</Typography>
        <button
          className="close-btn"
          onClick={() => onCloseWindow(chatBuddyUsername)}
        >
          <CloseIcon />
        </button>
      </div>
      <Divider />
      <ChatMessagesBlock
        messages={messages}
        isLoading={isLoadingMessages}
        username={username}
      />
      <ChatInput
        addMessage={(content, timestamp) =>
          handleUserMesssage(username, content, timestamp)
        }
      />
    </>
  );
}
