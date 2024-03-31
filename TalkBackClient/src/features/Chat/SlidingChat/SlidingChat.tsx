import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import ChatWindow from "../ChatWindow";
import "./SlidingChat.css";

interface Props {
  isOpen: boolean;
  openChat: string;
  setIsOpen: (value: boolean) => void;
}

export default function SlidingChatPanel(props: Props) {
  const { isOpen, openChat, setIsOpen } = props;

  return (
    <SlidingPane
      width="40%"
      className="sliding-pane"
      isOpen={isOpen}
      title="Chat"
      onRequestClose={() => {
        setIsOpen(false);
      }}
    >
      <div style={{height: '70%'}}>
        {openChat && (
          <ChatWindow chatBuddyUsername={openChat} onCloseWindow={() => {}} />
        )}
      </div>
    </SlidingPane>
  );
}
