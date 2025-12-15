/**
 * ChartBlock Component
 *
 * Renders data visualization charts using Recharts.
 * This component is lazy-loaded to minimize bundle size.
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartBlock as ChartBlockType } from '@/types/contentBlocks';
import { getChartStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

export const ChartBlock: React.FC<BlockProps<ChartBlockType>> = ({
  block,
  theme,
  className = '',
  fillContainer = false,
}) => {
  const styles = getChartStyles(theme);

  // Transform data for Recharts format
  const chartData = useMemo(() => {
    return block.data.labels.map((label, index) => ({
      name: label,
      value: block.data.values[index],
    }));
  }, [block.data]);

  // Get colors for chart
  const colors = block.data.colors || styles.defaultColors;

  // Common chart container styles
  const containerStyle: React.CSSProperties = {
    fontFamily: styles.fontBody,
  };

  // Tooltip styling
  const tooltipStyle: React.CSSProperties = {
    background: styles.tooltipBackground,
    color: styles.tooltipText,
    border: `1px solid ${styles.border}`,
    borderRadius: styles.radius,
    padding: '8px 12px',
  };

  const renderChart = () => {
    switch (block.chartType) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridColor} />
            <XAxis
              dataKey="name"
              stroke={styles.axisColor}
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke={styles.axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: styles.gridColor }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridColor} />
            <XAxis
              dataKey="name"
              stroke={styles.axisColor}
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke={styles.axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2 }}
              activeDot={{ r: 6, fill: colors[0] }}
            />
          </LineChart>
        );

      case 'pie':
      case 'donut':
        const innerRadius = block.chartType === 'donut' ? 60 : 0;
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: styles.text }}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${className}`}
      style={{
        ...containerStyle,
        ...(fillContainer ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' } : {}),
      }}
    >
      {block.title && (
        <h4
          className="text-center mb-4 font-semibold"
          style={{
            color: styles.text,
            fontFamily: styles.fontHeading,
          }}
        >
          {block.title}
        </h4>
      )}
      <div className="w-full" style={{ height: fillContainer ? '100%' : 280, flex: fillContainer ? 1 : undefined }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>Unsupported chart type</div>}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartBlock;
