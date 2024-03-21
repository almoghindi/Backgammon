import ChatMessage from "../ChatMessage/ChatMessage";
import MessageModel from "../models/MessageModel";
import "./ChatMessagesBlock.css";
import { v4 as uuidv4 } from "uuid";

interface ChatMessages {
  messages: MessageModel[];
  username: string;
}

export default function ChatMessagesBlock(props: ChatMessages) {
  const { messages, username } = props;

  return (
    <>
      <div className="messages-container">
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
      </div>
    </>
  );
}
