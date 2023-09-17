import { useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { COLORS, COLOR_LEGEND_HEIGHT, THRESHOLDS } from "./constants";


type HeatmapProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: string | null }[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number | null;
};

export const Heatmap = ({ width, height, data }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  data
    .map((d) => d.value)
    .filter((d): d is string => d !== null);

    const getColorForValue = (value: any | null) => {
      if (value === null) {
        return COLORS[COLORS.length - 1]; // Use the last color for null values which is "white"
      }
      
      for (let i = 0; i < THRESHOLDS.length; i++) {
        if (value === THRESHOLDS[i]) {
          return COLORS[i];
        }
      }
  
      return COLORS[COLORS.length - 1];
    };
  return (
    <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
        data={data}
        setHoveredCell={setHoveredCell}
        colorScale={getColorForValue}
      />
      <Tooltip
        interactionData={hoveredCell}
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
      />
    </div>
  );
};
