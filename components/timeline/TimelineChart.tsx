import { useEffect, useMemo, useRef } from 'react';
import uPlot from 'uplot';
import type { TimelinePoint } from '@/types/session';

interface TimelineChartProps {
  points: TimelinePoint[];
  xLabels: string[];
  height?: number;
}

/**
 * TimelineChart - uPlot-based timeline (Phase 7).
 * We render the plot without axes and keep the Figma-style labels ourselves.
 */
export function TimelineChart({ points, xLabels, height = 157 }: TimelineChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<uPlot | null>(null);

  const sorted = useMemo(() => {
    return [...points].sort((a, b) => a.timestamp - b.timestamp);
  }, [points]);

  const data = useMemo((): uPlot.AlignedData => {
    if (sorted.length === 0) return [[], []];
    const xs = sorted.map((p) => p.timestamp / 1000);
    const ys = sorted.map((p) => p.value);
    return [xs, ys];
  }, [sorted]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const build = () => {
      const width = el.clientWidth;
      if (width <= 0) return;

      // Tear down existing plot
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }

      // uPlot needs a minimal amount of CSS-less styling
      const opts: uPlot.Options = {
        width,
        height: Math.max(80, height - 44), // leave room for our labels
        padding: [6, 6, 6, 6],
        legend: { show: false },
        cursor: { show: false },
        axes: [],
        scales: {
          x: { time: true },
          y: { range: [0, 100] },
        },
        series: [
          {},
          {
            stroke: 'rgba(155, 56, 255, 0.9)',
            width: 2,
            fill: 'rgba(155, 56, 255, 0.25)',
          },
        ],
      };

      plotRef.current = new uPlot(opts, data, el);
    };

    build();

    const ro = new ResizeObserver(() => build());
    ro.observe(el);

    return () => {
      ro.disconnect();
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
  }, [data, height]);

  return (
    <div
      className="bg-black border border-white/20 rounded-xl p-5 relative overflow-hidden"
      style={{ width: '100%', height }}
    >
      {/* Y-axis label (rotated) */}
      <div
        className="absolute left-1 top-1/2 text-[7.3px] text-text-muted font-inter font-medium"
        style={{
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center',
          letterSpacing: '-0.219px',
        }}
      >
        Mental State
      </div>

      {/* Plot area */}
      <div className="ml-6 mr-2 h-[calc(100%-24px)] relative">
        {sorted.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] text-text-secondary/60 font-manrope bg-black/50 px-2 py-1 rounded">
              Waiting for session data…
            </p>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 ml-6 mr-2">
        {xLabels.map((label) => (
          <span
            key={label}
            className="text-[7.3px] text-text-muted font-inter font-medium"
            style={{ letterSpacing: '-0.219px' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TimelineChart;

