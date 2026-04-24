import React from "react";
import COLORS from "@repo/ui/colors";
import type { OverviewActivityPoint } from "@/utils/dummyData/overviewData";
import { ChartCard, ChartScroll, ChartSvg } from "./styles";

type OverviewActivityChartProps = {
  data: OverviewActivityPoint[];
};

const CHART_SERIES = [
  { key: "rentals", color: COLORS.primary.BLUE },
  { key: "purchases", color: COLORS.primary.ORANGE },
  { key: "views", color: COLORS.secondary.MEDIUM_GREEN },
  { key: "visits", color: COLORS.gredint.PALE_GREEN },
  { key: "downloads", color: COLORS.primary.GREEN_100 },
] as const;

const PLACEHOLDER_STACK = [1, 2, 3, 4];
const MAX_VALUE = 10;
const SVG_WIDTH = 1280;
const SVG_HEIGHT = 420;
const CHART_MARGIN = { top: 16, right: 18, bottom: 54, left: 58 };
const SEGMENT_GAP = 6;
const BACKGROUND_FILL = "rgba(6, 6, 6, 0.06)";
const GRID_STROKE = "rgba(6, 6, 6, 0.16)";
const AXIS_STROKE = "rgba(6, 6, 6, 0.12)";
const LABEL_FILL = "rgba(6, 6, 6, 0.56)";

type Segment = {
  color: string;
  value: number;
};

function renderSegments(
  segments: Segment[],
  x: number,
  barWidth: number,
  plotBottom: number,
  unitHeight: number,
  prefix: string,
) {
  let cumulativeValue = 0;
  const lastIndex = segments.length - 1;

  return segments.map((segment, index) => {
    const rawTop = plotBottom - (cumulativeValue + segment.value) * unitHeight;
    const rawHeight = segment.value * unitHeight;
    const topInset = index < lastIndex ? SEGMENT_GAP / 2 : 0;
    const bottomInset = index > 0 ? SEGMENT_GAP / 2 : 0;
    const height = Math.max(rawHeight - topInset - bottomInset, 8);
    const y = rawTop + topInset;

    cumulativeValue += segment.value;

    return (
      <rect
        key={`${prefix}-${segment.color}-${index}`}
        x={x}
        y={y}
        width={barWidth}
        height={height}
        rx={barWidth / 3}
        fill={segment.color}
      />
    );
  });
}

export default function OverviewActivityChart({
  data,
}: OverviewActivityChartProps) {
  const plotWidth = SVG_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
  const plotHeight = SVG_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;
  const plotBottom = SVG_HEIGHT - CHART_MARGIN.bottom;
  const plotLeft = CHART_MARGIN.left;
  const plotRight = SVG_WIDTH - CHART_MARGIN.right;
  const unitHeight = plotHeight / MAX_VALUE;
  const columnWidth = plotWidth / data.length;
  const barWidth = Math.min(24, Math.max(18, columnWidth * 0.38));
  const minimumWidth = Math.max(760, data.length * 52);

  return (
    <ChartCard>
      <ChartScroll>
        <ChartSvg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          role="img"
          aria-label="Creator activity stacked bar chart"
          style={{ minWidth: minimumWidth }}
        >
          <line
            x1={plotLeft}
            y1={CHART_MARGIN.top}
            x2={plotLeft}
            y2={plotBottom}
            stroke={AXIS_STROKE}
            strokeWidth="1.5"
          />

          {Array.from({ length: MAX_VALUE + 1 }, (_, index) => {
            const y = plotBottom - index * unitHeight;
            const isBaseline = index === 0;

            return (
              <g key={`grid-${index}`}>
                <line
                  x1={plotLeft}
                  y1={y}
                  x2={plotRight}
                  y2={y}
                  stroke={isBaseline ? AXIS_STROKE : GRID_STROKE}
                  strokeDasharray={isBaseline ? undefined : "6 6"}
                  strokeWidth={isBaseline ? "1.5" : "1"}
                />
                <text
                  x={plotLeft - 22}
                  y={y}
                  fill={LABEL_FILL}
                  fontSize="12"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {index}
                </text>
              </g>
            );
          })}

          {data.map((point, index) => {
            const centerX = plotLeft + columnWidth * index + columnWidth / 2;
            const x = centerX - barWidth / 2;
            const placeholderSegments = PLACEHOLDER_STACK.map((value) => ({
              color: BACKGROUND_FILL,
              value,
            }));
            const activeSegments = CHART_SERIES.map((series) => ({
              color: series.color,
              value: point[series.key],
            })).filter((segment) => segment.value > 0);

            return (
              <g key={point.label}>
                {renderSegments(
                  placeholderSegments,
                  x,
                  barWidth,
                  plotBottom,
                  unitHeight,
                  `placeholder-${point.label}`,
                )}
                {renderSegments(
                  activeSegments,
                  x,
                  barWidth,
                  plotBottom,
                  unitHeight,
                  point.label,
                )}
                <text
                  x={centerX}
                  y={SVG_HEIGHT - 16}
                  fill={LABEL_FILL}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </ChartSvg>
      </ChartScroll>
    </ChartCard>
  );
}
