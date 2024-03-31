import "./Die.css";
import { FaceToPath } from "./diceData";

export default function Die(props: { face: number }) {
  const { face } = props;

  return (
    <div>
      <DynamicSVG
        fill="#eae9ea"
        width="50px"
        height="50px"
        viewBox="0 0 32 32"
        pathData={FaceToPath[face]}
      />
    </div>
  );
}

const DynamicSVG = (props: {
  fill: string;
  width: string;
  height: string;
  viewBox: string;
  pathData: string;
  className?: string;
}) => {
  const { fill, width, height, viewBox, pathData, className } = props;
  return (
    <svg
      fill={fill}
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={pathData}></path>
    </svg>
  );
};
