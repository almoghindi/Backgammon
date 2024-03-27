import { Typography } from "@mui/material";
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
      <Typography>Time: {formattedTime}</Typography>
    </>
  );
}
