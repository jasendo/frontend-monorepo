import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import isEqual from 'lodash/isEqual';
import React from 'react';

function colorByChange(a: number, b: number) {
  return a === b
    ? 'stroke-black/40 dark:stroke-white/40'
    : a < b
    ? 'stroke-bullish'
    : 'stroke-bearish';
}

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  points?: number;
  className?: string;
}

export const SparklineView = ({
  data,
  width = 60,
  height = 15,
  points = 25,
  className,
}: SparklineProps) => {
  // How many points are missing. If market is 12 hours old the 25 - 12
  const preMarketLength = points - data.length;

  // Create two dimensional array for sparkline points [x, y]
  const marketData: [number, number][] = data.map((d, i) => [
    preMarketLength + i,
    d,
  ]);
  // Empty two dimensional array for gray, 'no data' line
  let preMarketData: [number, number][] = [];

  // Get the extent for our y value
  const [min, max] = extent(marketData, (d) => d[1]);

  if (typeof min !== 'number' || typeof max !== 'number') {
    return null;
  }

  // Create a second set of data to render a gray line for any
  // missing points if the market is less than 24 hours old
  if (marketData.length < points) {
    // Populate preMarketData with the average of our extents
    // so that the line renders centered vertically
    const fillValue = (min + max) / 2;
    preMarketData = new Array(points - marketData.length)
      .fill(fillValue)
      .map((d: number, i) => [i, d] as [number, number]);

    // Add the first point of or market data so that the two
    // lines join up
    preMarketData.push(marketData[0] as [number, number]);
  }

  const xScale = scaleLinear().domain([0, points]).range([0, 100]);
  const yScale = scaleLinear().domain([min, max]).range([100, 0]);

  const lineSeries = line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  // Get the color of the marketData line
  const [firstVal, lastVal] = [data[0], data[data.length - 1]];
  const strokeClassName =
    data.length >= 24
      ? colorByChange(firstVal, lastVal)
      : 'stroke-black/40 dark:stroke-white/40';

  // Create paths
  const preMarketCreationPath = lineSeries(preMarketData);
  const mainPath = lineSeries(marketData);

  return (
    <svg
      data-testid="sparkline-svg"
      className={`pt-px pr-0 w-full overflow-visible ${className}`}
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {preMarketCreationPath && (
        <path
          data-testid="sparkline-path"
          className={`[vector-effect:non-scaling-stroke] ${strokeClassName}`}
          d={preMarketCreationPath}
          stroke="strokeCurrent"
          strokeWidth={2}
          fill="transparent"
        />
      )}
      {mainPath && (
        <path
          data-testid="sparkline-path"
          d={mainPath}
          className={strokeClassName}
          stroke="strokeCurrent"
          strokeWidth={1}
          fill="transparent"
        />
      )}
    </svg>
  );
};

SparklineView.displayName = 'SparklineView';

// Use react memo to only re-render if props change
export const Sparkline = React.memo(
  SparklineView,
  function (prevProps, nextProps) {
    // Warning! The return value here is the opposite of shouldComponentUpdate.
    // Return true if you DON NOT want a re-render
    if (
      prevProps.width !== nextProps.width ||
      prevProps.height !== nextProps.height
    ) {
      return false;
    }
    return isEqual(prevProps.data, nextProps.data);
  }
);

Sparkline.displayName = 'Sparkline';
