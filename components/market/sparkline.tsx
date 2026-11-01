interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Hand built path, no chart library. The history is short enough that a plain
 * polyline reads better than a smoothed curve, and it keeps the mark honest
 * about the data.
 */
export function Sparkline({ values, width = 120, height = 36, className }: SparklineProps) {
  if (values.length < 2) {
    return (
      <svg
        aria-hidden
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
      >
        <line
          x1={0}
          y1={height - 0.5}
          x2={width}
          y2={height - 0.5}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - 1 - ((value - min) / span) * (height - 3);
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      data-testid="sparkline"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="spark-path"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={1.6} fill="currentColor" />
    </svg>
  );
}
