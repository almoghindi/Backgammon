import toast from "react-hot-toast";
import ThisTurn from "../logic/models/this-turn";

export const toastStyle = (thisTurn: ThisTurn) => {
    return {
      style: {
        borderRadius: "10px",
        background: thisTurn._turnPlayer._name,
        color: thisTurn._opponentPlayer._name,
        border:
          thisTurn._turnPlayer._name === "White"
            ? "2px solid black"
            : "2px solid white",
      },
    };
  };

  export function toastMessage(messageJSON: string) {
    const { message, turn } = JSON.parse(messageJSON);
    toast.success(message, toastStyle(turn));
  }