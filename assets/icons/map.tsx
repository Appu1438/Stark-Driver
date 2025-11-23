import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export const Map = ({ fill = "#000", width = 26, height = 26 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6l6-3 6 3 6-3v14.5l-6 3-6-3-6 3V6z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" fill={fill} />
    </Svg>
  );
};
