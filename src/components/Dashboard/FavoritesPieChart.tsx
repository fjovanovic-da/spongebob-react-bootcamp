import { memo, useCallback, useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_COLORS, CHART_CONFIG } from "../../config";
import type {
  ChartEmptyStateProps,
  FavoritesPieChartProps,
  PieLabelRenderProps,
} from "../../types";

const ChartEmptyState = memo(function ChartEmptyState({
  title,
  message = "No data",
}: ChartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center rounded-full bg-base-300 chart-empty-state">
        <span className="text-base-content/60 text-sm">{message}</span>
      </div>
    </div>
  );
});

function FavoritesPieChartComponent({ data, title }: FavoritesPieChartProps) {
  const renderLabel = useCallback(
    ({ percent }: PieLabelRenderProps) =>
      `${((percent ?? 0) * 100).toFixed(0)}%`,
    []
  );

  const legendFormatter = useCallback(
    (value: string) => <span className="legend-label">{value}</span>,
    []
  );

  const chartCells = useMemo(
    () =>
      data.map((entry, index) => (
        <Cell
          key={entry.name}
          fill={CHART_COLORS[index % CHART_COLORS.length]}
        />
      )),
    [data]
  );

  if (data.length === 0) {
    return <ChartEmptyState title={title} />;
  }

  return (
    <div className="flex flex-col items-center w-full min-w-0">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx={CHART_CONFIG.CENTER_X}
              cy={CHART_CONFIG.CENTER_Y}
              outerRadius={CHART_CONFIG.OUTER_RADIUS}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
            >
              {chartCells}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={legendFormatter}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const FavoritesPieChart = memo(FavoritesPieChartComponent);
