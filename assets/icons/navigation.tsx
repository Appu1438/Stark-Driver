import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Navigation = ({ fill = "#000", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.4 2.6l17.1 7.3c1.2.5 1.2 2.2 0 2.7L12.8 16l-3.5 7c-.3.7-1.3.6-1.5-.1L2.3 3.9c-.2-.7.5-1.4 1.1-1.3z"
      fill={fill}
    />
  </Svg>
);
