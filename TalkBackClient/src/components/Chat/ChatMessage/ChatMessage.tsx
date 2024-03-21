import { Card, Divider, Typography } from "@mui/material";
import "./ChatMessage.css";

interface ChatMessageProps {
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { sender, content, timestamp } = props;

  return (
    <>
      <div>
        <Card>
          <div className="card-header">
            <Typography ml={1}>{sender}</Typography>
            <Typography mr={1}>{timestamp}</Typography>
          </div>
          <Divider></Divider>
          <Typography
            ml={1}
            style={{ wordWrap: "break-word" }}
            height={"fit-content"}
          >
            {content}
          </Typography>
        </Card>
      </div>
    </>
  );
}
