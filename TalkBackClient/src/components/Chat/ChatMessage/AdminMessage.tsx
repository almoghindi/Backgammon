import { Divider, Typography } from "@mui/material";
import { useMemo } from "react";
import "./AdminMessage.css";

interface Props {
  content: string;
  timestamp: Date;
}

export default function AdminMessage(props: Props) {
  const { content, timestamp } = props;
  const formattedTimestamp: Date = useMemo(() => {
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  }, [timestamp]);

  return (
    <>
      <div className="message-container">
        <div className="message-header">
          <Typography>Admin: </Typography>
          <Typography className="timestamp">{formattedTimestamp.toLocaleTimeString()}</Typography>
        </div>
        <Divider></Divider>
        <span>{` ${content}`}</span>
      </div>
    </>
  );
}
