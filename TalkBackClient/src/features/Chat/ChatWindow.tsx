import { useCallback, useContext, useEffect, useState } from "react";
import { chatSocket as socket } from "../../utils/socketConnection";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Divider, Typography } from "@mui/material";
import ChatInput from "../../components/Chat/ChatInput/ChatInput.tsx";
import MessageModel from "../../types/message.model.tsx";
import ChatMessagesBlock from "../../components/Chat/ChatMessagesBlock/ChatMessagesBlock";
import { useHttpClient } from "../../hooks/useHttp.tsx";
import { v4 as uuidv4 } from "uuid";
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

interface SendMessageResponse {
  success: boolean;
  message: string;
  timestamp: Date;
}

export default function ChatWindow(props: Props) {
  const { chatBuddyUsername } = props;
  const [messages, setMessages] = useState<MessageModel[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const newMessage = new MessageModel(sender, content, timestamp, uuidv4());
    addMessage(newMessage);
    sendNewMessage(newMessage);
  }

  function handleIncomingMessage(messageJson: MessageModel) {
    const message = messageJson;
    if (message.sender !== chatBuddyUsername) return;
    addMessage({ ...message, isSent: true });
  }

  const sendNewMessage = async (messageToSend: MessageModel) => {
    try {
      const response = await sendRequest<SendMessageResponse>(
        `http://localhost:3002/api/chat/new-message`,
        "POST",
        { message: messageToSend, to: chatBuddyUsername },
        { authorization: `Bearer ${token}` }
      );
      if (!response || !response.success) {
        throw new Error(response.message);
      }
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.messageId === messageToSend.messageId) {
            return {
              ...msg,
              timestamp: response.timestamp,
              isError: false,
              isSent: true,
            };
          }
          return msg;
        });
      });
    } catch (err) {
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.messageId === messageToSend.messageId) {
            return { ...msg, isError: true, isSent: false };
          }
          return msg;
        });
      });

      console.error(err);
    }
  };

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
        // console.error(err);
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
      setMessages(response.messages);
      setIsLoadingMessages(false);
    } catch (err) {
      console.error(err);
    }
  }, [token, username, chatBuddyUsername]);

  useEffect(() => {
    function onConnect(sender: string) {
      if (sender !== username && sender !== chatBuddyUsername) return;
      fetchMessages();
    }

    function onMount() {
      try {
        if (!username) return;
        const data = {
          username: username,
          socketId: socket.id === undefined ? "" : socket.id,
        };
        askToEnterChat(data);
        onConnect(username);
      } catch (err) {
        console.error(err);
      }
    }

    onMount();
    socket.on("new-message", handleIncomingMessage);
    socket.on("user-disconnected", handleIncomingMessage);
    return () => {
      socket.off("new-message", handleIncomingMessage);
      socket.on("user-disconnected", handleIncomingMessage);
    };
  }, [username]);

  return (
    <>
      {isLoadingMessages && <LoadingSpinner />}
      <div style={{ backgroundColor: "#787878" }}>
        <div className="chat-window-header">
          <Typography>Chat with: {chatBuddyUsername}</Typography>
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
      </div>
    </>
  );
}
