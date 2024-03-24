import ChatMessage from "../ChatMessage/ChatMessage";
import MessageModel from "../models/MessageModel";
import "./ChatMessagesBlock.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useEffect } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import AdminMessage from "../ChatMessage/AdminMessage";

interface ChatMessages {
  messages: MessageModel[];
  username: string;
  isLoading: boolean;
}

export default function ChatMessagesBlock(props: ChatMessages) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, username, isLoading } = props;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const getClassName = (message: MessageModel) => {
    let name = "message ";
    if (message.isAdmin) name += "admin";
    else if (message.sender === username) name += "self";
    return name;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <div className="messages-container">
        {isLoading && <LoadingSpinner />}
        {messages &&
          messages.map((m) => (
            <div key={uuidv4()} className={getClassName(m)}>
              {m.isAdmin ? (
                <AdminMessage content={m.content} timestamp={m.timestamp} />
              ) : (
                <ChatMessage message={m}></ChatMessage>
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
