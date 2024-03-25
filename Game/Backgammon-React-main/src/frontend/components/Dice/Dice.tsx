import Die from "./Die.jsx";
import "./Dice.css";

const numberToDieFaceMap: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};

export default function Dice(props: { dice: number[]; isRolling: boolean }) {
  const { dice, isRolling } = props;

  return (
    <div className="RollDice">
      <div className="RollDice-container">
        {dice &&
          dice.map((d, index) => (
            <Die key={index} face={numberToDieFaceMap[d]} rolling={isRolling} />
          ))}
      </div>
    </div>
  );
}
