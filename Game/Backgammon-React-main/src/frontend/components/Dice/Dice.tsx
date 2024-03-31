import Die from "./Die.jsx";
import "./Dice.css";
import { useEffect, useMemo, useState } from "react";

export default function Dice(props: { dice: number[]; }) {
  const { dice } = props;
  const formattedDice = useMemo(() => {
    if (dice.length > 2) {
      return dice.slice(0, 2);
    }
    return dice;
  }, [dice]);

  return (
    <div className="RollDice">
      <div className="RollDice-container">
        {formattedDice &&
          formattedDice.map((d, index) => (
            <Die key={index} face={d}/>
          ))}
      </div>
    </div>
  );
}
