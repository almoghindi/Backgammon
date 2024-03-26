import { Card, Divider, Typography } from "@mui/material";
import "./ChatMessage.css";
import { useMemo } from "react";
import MessageModel from "../../../types/message.model.tsx";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";

interface ChatMessageProps {
  message: MessageModel;
  isSelf: boolean;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { sender, content, timestamp, isError, isSent } = props.message;
  const { isSelf } = props;
  const formattedTimestamp: Date = useMemo(() => {
    console.log(timestamp);
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  }, [timestamp]);

  return (
    <>
      <div>
        <Card
          sx={{
            backgroundColor: isError
              ? "lightgrey"
              : "white" && isSelf
              ? "#ADD8E6"
              : "white",
          }}
        >
          <div className="card-header">
            <Typography ml={1}>{isSelf ? "You" : sender}</Typography>
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
              {isSelf && <DoneIcon sx={{ color: "grey", fontSize: "small" }} />}
              {formattedTimestamp && formattedTimestamp.toLocaleTimeString()}
            </div>
          )}
          {isError && <p className="error-message">Message not sent!</p>}
        </Card>
      </div>
    </>
  );
}
