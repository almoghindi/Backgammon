import ChatMessage from "../ChatMessage/ChatMessage";
import MessageModel from "../models/MessageModel";
import "./ChatMessagesBlock.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useEffect } from "react";
import LoadingSpinner from "../../LoadingSpinner";

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <div className="messages-container">
        {isLoading && <LoadingSpinner />}
        {messages &&
          messages.map((m) => (
            <div
              key={uuidv4()}
              className={m.sender === username ? "self message" : "message"}
            >
              <ChatMessage
                sender={m.sender === username ? "You" : m.sender}
                content={m.content}
                timestamp={m.timestamp}
              ></ChatMessage>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
