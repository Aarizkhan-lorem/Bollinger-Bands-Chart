"use client";
import React, { useEffect, useRef } from "react";
import { init, dispose, type Chart, LineType, CandleType } from "klinecharts";
import {
  OHLCVData,
  BollingerBandsOptions,
  BollingerBandsStyle,
} from "../lib/types";
import { computeBollingerBands } from "../lib/indicators/bollinger";

// Props for the Chart component
interface ChartProps {
  data: OHLCVData[];
  bollingerOptions: BollingerBandsOptions;
  bollingerStyle: BollingerBandsStyle;
  showBollinger: boolean;
}

const ChartComponent: React.FC<ChartProps> = ({
  data,
  bollingerOptions,
  bollingerStyle,
  showBollinger,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = init(chartRef.current);

      // ✅ Dark theme styles with correct typings
      chartInstance.current?.setStyles({
        grid: {
          horizontal: {
            color: "#393939",
            size: 1,
            style: LineType.Dashed,
          },
          vertical: {
            color: "#393939",
            size: 1,
            style: LineType.Dashed,
          },
        },
        candle: {
          type: CandleType.CandleSolid,
          bar: {
            upColor: "#26A69A",
            downColor: "#EF5350",
            noChangeColor: "#888888",
          },
          tooltip: {
            rect: {
              color: "rgba(0, 0, 0, 0.8)",
            },
            text: {
              color: "#D9D9D9",
            },
          },
        },
        crosshair: {
          horizontal: {
            line: {
              color: "#9B9B9B",
              size: 1,
              style: LineType.Dashed,
            },
          },
          vertical: {
            line: {
              color: "#9B9B9B",
              size: 1,
              style: LineType.Dashed,
            },
          },
        },
        yAxis: {
          axisLine: { color: "#888888" },
          tickText: { color: "#D9D9D9" },
          tickLine: { color: "#888888" },
        },
        xAxis: {
          axisLine: { color: "#888888" },
          tickText: { color: "#D9D9D9" },
          tickLine: { color: "#888888" },
        },
      });
    }

    return () => {
      if (chartInstance.current && chartRef.current) {
        dispose(chartRef.current);
        chartInstance.current = null;
      }
    };
  }, []);

  // Update chart data and indicators
  useEffect(() => {
    if (!chartInstance.current || !data.length) return;

    try {
      const klineData = data.map((item) => ({
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

      chartInstance.current.applyNewData(klineData);

      if (showBollinger) {
        const bollingerData = computeBollingerBands(data, bollingerOptions);

        const bollingerIndicator = {
          name: "BOLL",
          shortName: "BOLL",
          calcParams: [
            bollingerOptions.length,
            bollingerOptions.stdDevMultiplier,
          ],
          shouldOhlc: false,
          shouldFormatBigNumber: false,
          precision: 2,
          minValue: null,
          maxValue: null,
          styles: {
            lines: [
              {
                color: bollingerStyle.upper.color,
                size: bollingerStyle.upper.lineWidth,
                style:
                  bollingerStyle.upper.lineStyle === "dashed"
                    ? LineType.Dashed
                    : LineType.Solid,
              },
              {
                color: bollingerStyle.basis.color,
                size: bollingerStyle.basis.lineWidth,
                style:
                  bollingerStyle.basis.lineStyle === "dashed"
                    ? LineType.Dashed
                    : LineType.Solid,
              },
              {
                color: bollingerStyle.lower.color,
                size: bollingerStyle.lower.lineWidth,
                style:
                  bollingerStyle.lower.lineStyle === "dashed"
                    ? LineType.Dashed
                    : LineType.Solid,
              },
            ],
            areas: [
              {
                start: 0,
                end: 2,
                color:
                  bollingerStyle.fill.color +
                  Math.floor(bollingerStyle.fill.opacity * 255)
                    .toString(16)
                    .padStart(2, "0"),
              },
            ],
          },
          plots: [
            { key: "up", title: "UP: ", type: "line" },
            { key: "mid", title: "MID: ", type: "line" },
            { key: "dn", title: "DN: ", type: "line" },
          ],
          calc: () => {
            return bollingerData.map((bb) => {
              if (
                !bb ||
                isNaN(bb.upper) ||
                isNaN(bb.basis) ||
                isNaN(bb.lower)
              ) {
                return { up: null, mid: null, dn: null };
              }
              return {
                up: bollingerStyle.upper.visible ? bb.upper : null,
                mid: bollingerStyle.basis.visible ? bb.basis : null,
                dn: bollingerStyle.lower.visible ? bb.lower : null,
              };
            });
          },
        };

        chartInstance.current.removeIndicator({name:"BOLL"});
        chartInstance.current.createIndicator(bollingerIndicator, true);
      } else {
        chartInstance.current.removeIndicator({ name: "BOLL" });
      }
    } catch (error) {
      console.error("Error updating chart:", error);
    }
  }, [data, bollingerOptions, bollingerStyle, showBollinger]);

  return (
    <div
      ref={chartRef}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg"
      style={{ height: "500px", minHeight: "400px" }}
    />
  );
};

export default ChartComponent;
