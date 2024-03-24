import { Card, Divider, Typography } from "@mui/material";
import "./ChatMessage.css";
import { useMemo } from "react";
import MessageModel from "../models/MessageModel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";

interface ChatMessageProps {
  message: MessageModel;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { sender, content, timestamp, isError, isSent } = props.message;
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
            <Typography mr={1}></Typography>
          </div>
          <Divider></Divider>
          <Typography
            ml={1}
            style={{ wordWrap: "break-word" }}
            height={"fit-content"}
          >
            {content}
          </Typography>
          {!isError && !isSent && <AccessTimeIcon />}
          {!isError && isSent && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontSize: "x-small",
                alignItems: "center",
              }}
            >
              <DoneIcon />
              {formattedTimestamp && formattedTimestamp.toLocaleTimeString()}
            </div>
          )}
          {isError && <p>error</p>}
        </Card>
      </div>
    </>
  );
}
