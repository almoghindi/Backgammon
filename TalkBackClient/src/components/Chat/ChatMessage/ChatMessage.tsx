import { Card, Divider, Typography } from "@mui/material";
import "./ChatMessage.css";
import { useMemo } from "react";

interface ChatMessageProps {
  sender: string;
  content: string;
  timestamp: Date;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { sender, content, timestamp } = props;
  const formattedTimestamp: Date = useMemo(() => {
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  }, [timestamp]);

  return (
    <>
      <div>
        <Card>
          <div className="card-header">
            <Typography ml={1}>{sender}</Typography>
            <Typography mr={1}>
              {formattedTimestamp.toLocaleTimeString()}
            </Typography>
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
