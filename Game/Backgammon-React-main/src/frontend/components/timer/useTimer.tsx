import { useEffect, useState } from "react";

export default function useTimer() {
  const [timer, setTimer] = useState(119);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (timer === 0) return;
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [timer]);
  return [timer, setTimer] as const;
}
