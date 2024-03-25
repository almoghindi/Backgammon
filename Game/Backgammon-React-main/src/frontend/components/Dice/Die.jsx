import "./Die.css";

const svgUrl = `../../../assets/dice-`;

export default function Die(props) {
  const { face, rolling } = props;
  const iconName = `fa-dice-${face}`;

  return (
    <div
      className={`Die  
                ${rolling && "Die-shaking"}`}
    >
    </div>
  );
}
