import { useContext, useState } from "react";
import ChatWindow from "./ChatWindow";
import { AuthContext } from "../../context/auth-context";
import { v4 as uuidv4 } from "uuid";
import "./ChatTemp.css";

export default function ChatTemp() {
  const users = ["itzko", "almogo"];
  const { username } = useContext(AuthContext);
  const [activeChats, setActiveChats] = useState<string[]>([]);
  function openChatWindow(user: string) {
    if (activeChats.includes(user)) return;
    setActiveChats((prev) => [...prev, user]);
  }
  function closeChatWindow(user: string) {
    setActiveChats((prev) => prev.filter((u) => u !== user));
  }
  return (
    <>
      {users &&
        users.map(
          (user) =>
            username !== user && (
              <p key={uuidv4()} onClick={() => openChatWindow(user)}>
                {user}
              </p>
            )
        )}
      {activeChats &&
        activeChats.map((user) => (
          <div key={uuidv4()} className="chat-window">
            <ChatWindow
              chatBuddyUsername={user}
              onCloseWindow={closeChatWindow}
            />
          </div>
        ))}
    </>
  );
}
