import { Typography } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    let dotTimeout = setTimeout(() => {
      if (dots.length >= 3) {
        setDots("");
      } else {
        setDots((prev) => (prev += "."));
      }
    }, 1000);
    return () => {
      clearTimeout(dotTimeout);
    };
  }, [dots]);
  return (
    <>
      <div>
        <Typography sx={{ position: "relative", top: "-50px" }}>
          Waiting for Player{dots}
        </Typography>
        <div style={{ position: "absolute" }}>
          <LoadingSpinner />
        </div>
      </div>
    </>
  );
}
