import { Container, Typography } from "@mui/material";
import useTimer from "./useTimer";
import { useMemo } from "react";

export default function Timer(props: { timer: number }) {
  const { timer } = props;
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timer / 60);
    const seconds =
      Math.abs(timer - minutes * 60) < 10
        ? `0${timer - minutes * 60}`
        : `${timer - minutes * 60}`;
    return `${minutes}:${seconds}`;
  }, [timer]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#A9927D",
          padding: ".5em",
          borderRadius: "5px",
          border: "3px solid #040F0F",
          color: "#000",
          fontWeight: "extra-bold",
          boxShadow: "1px 1px 5px #040F0F inset",
        }}
      >
        <Typography>Time: {formattedTime}</Typography>
      </div>
    </>
  );
}
