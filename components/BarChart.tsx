import React from 'react';
import { type ChartData } from '../types';
import { ChartBarIcon } from './Icons';

interface BarChartProps {
  data: ChartData;
}

const COLORS = ['#8A2BE2', '#9370DB', '#BA55D3', '#DA70D6'];

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { title, labels, datasets } = data;

  const allDataPoints = datasets.flatMap(d => d.data);
  const maxValue = allDataPoints.length > 0 ? Math.max(...allDataPoints) : 0;
  const yAxisMax = Math.ceil(maxValue / 10) * 10 || 10; // Round up to nearest 10

  const chartHeight = 250;
  const chartWidth = 500;
  const yAxisWidth = 40;
  const xAxisHeight = 50;
  const plotAreaWidth = chartWidth - yAxisWidth;
  const plotAreaHeight = chartHeight - xAxisHeight;

  const barWidth = plotAreaWidth / labels.length * 0.8;
  const barGap = plotAreaWidth / labels.length * 0.2;
  
  // Calculate group properties
  const barsPerGroup = datasets.length;
  const groupWidth = barWidth;
  const individualBarWidth = Math.max(1, groupWidth / barsPerGroup - (barsPerGroup > 1 ? 2 : 0));


  return (
    <div className="text-text-main">
      <h3 className="text-md font-semibold text-center mb-2 flex items-center justify-center gap-2">
        <ChartBarIcon className="w-5 h-5"/>
        {title}
      </h3>
      <div className="flex justify-center text-xs space-x-4 mb-4">
        {datasets.map((dataset, index) => (
          <div key={dataset.label} className="flex items-center">
            <span style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-3 h-3 rounded-sm mr-2"></span>
            <span>{dataset.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
        <title id="chart-title">{title}</title>
        
        {/* Y-axis Lines and Labels */}
        <g className="text-xs text-text-secondary" transform={`translate(${yAxisWidth}, 0)`}>
            {[...Array(5)].map((_, i) => {
                const y = plotAreaHeight - (i * plotAreaHeight / 4);
                const value = yAxisMax / 4 * i;
                return (
                    <g key={i}>
                        <line x1={-5} y1={y} x2={plotAreaWidth} y2={y} stroke="currentColor" strokeDasharray="2,2" opacity="0.3" />
                        <text x="-10" y={y + 4} textAnchor="end" fill="currentColor">{value}</text>
                    </g>
                );
            })}
             <g>
                <line x1={-5} y1={0} x2={plotAreaWidth} y2={0} stroke="currentColor" strokeDasharray="2,2" opacity="0.3" />
                <text x="-10" y={4} textAnchor="end" fill="currentColor">{yAxisMax}</text>
            </g>
        </g>
        
        {/* Bars and X-axis Labels */}
        {labels.map((label, i) => {
            const groupX = yAxisWidth + barGap/2 + i * (barWidth + barGap);
            return (
                <g key={label}>
                    {datasets.map((dataset, j) => {
                       const barHeight = (dataset.data[i] / yAxisMax) * plotAreaHeight;
                       const barX = groupX + (j * individualBarWidth);
                       return (
                           <rect
                               key={`${label}-${dataset.label}`}
                               x={barX}
                               y={plotAreaHeight - barHeight}
                               width={individualBarWidth}
                               height={barHeight}
                               fill={COLORS[j % COLORS.length]}
                           >
                            <title>{`${dataset.label}: ${dataset.data[i]}`}</title>
                           </rect>
                       )
                    })}
                    <text
                        x={groupX + groupWidth / 2}
                        y={plotAreaHeight + 20}
                        textAnchor="middle"
                        className="text-xs text-text-secondary"
                        fill="currentColor"
                    >
                        {label}
                    </text>
                </g>
            )
        })}

        {/* Axes Lines */}
        <line x1={yAxisWidth} y1="0" x2={yAxisWidth} y2={plotAreaHeight} stroke="currentColor" opacity="0.5" />
        <line x1={yAxisWidth} y1={plotAreaHeight} x2={chartWidth} y2={plotAreaHeight} stroke="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
};

export default BarChart;