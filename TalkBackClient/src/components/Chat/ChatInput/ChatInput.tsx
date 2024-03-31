import { useState } from "react";
import "./ChatInput.css";

interface ChatInputProps {
  addMessage: (value: string, timestamp: Date) => void;
}

export default function ChatInput(props: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage } = props;
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    addMessage(message, new Date());
    setMessage("");
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setMessage(value);
  }

  return (
    <>
      <form className="sendmessage-form" onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={handleChange}
          className="message-input"
          autoComplete="off"
          id="message"
          aria-describedby="message-input"
        />
        <button disabled={message === ""} type="submit" className="send-btn">
          Send
        </button>
      </form>
    </>
  );
}
