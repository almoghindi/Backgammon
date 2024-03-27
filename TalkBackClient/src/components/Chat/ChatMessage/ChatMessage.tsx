import { Card, Divider, Typography, Button } from "@mui/material";
import "./ChatMessage.css";
import { useMemo, useState } from "react";
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
  const [showFullMessage, setShowFullMessage] = useState(false);

  const formattedTimestamp: Date = useMemo(() => {
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  }, [timestamp]);

  const truncatedContent = useMemo(() => {
    if (content.length > 100) {
      return `${content.substring(0, 97)}...`;
    }
    return content;
  }, [content]);

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
            <Typography variant="body1" ml={1}>
              {isSelf ? "You" : sender}
            </Typography>
            <Typography mr={1}></Typography>
          </div>
          <Divider></Divider>
          <Typography
            ml={1}
            style={{ wordWrap: "break-word", fontSize: "15px" }}
            height={"fit-content"}
          >
            {showFullMessage || content.length <= 100
              ? content
              : truncatedContent}
            {content.length > 100 && (
              <>
                <br />
                <Button
                  color="primary"
                  sx={{
                    fontSize: "x-small",
                    padding: "4px 0",
                    margin: 0,
                    textTransform: "none",
                    minWidth: "auto",
                  }}
                  onClick={() => setShowFullMessage(!showFullMessage)}
                >
                  {showFullMessage ? "Read Less" : "Read More"}
                </Button>
              </>
            )}
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
              {formattedTimestamp &&
                formattedTimestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </div>
          )}
          {isError && <p className="error-message">Message not sent!</p>}
        </Card>
      </div>
    </>
  );
}
