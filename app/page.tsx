// app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";
import BollingerSettings from "../components/BollingerSettings";
import {
  OHLCVData,
  BollingerBandsOptions,
  BollingerBandsStyle,
} from "../lib/types";
import { defaultBollingerOptions } from "../lib/indicators/bollinger";

// Default style configuration
const defaultBollingerStyle: BollingerBandsStyle = {
  basis: {
    visible: true,
    color: "#2196F3",
    lineWidth: 1,
    lineStyle: "solid",
  },
  upper: {
    visible: true,
    color: "#FF9800",
    lineWidth: 1,
    lineStyle: "solid",
  },
  lower: {
    visible: true,
    color: "#FF9800",
    lineWidth: 1,
    lineStyle: "solid",
  },
  fill: {
    visible: true,
    opacity: 0.1,
    color: "#FF9800",
  },
};

// Sample data generator (since we can't load files in this environment)
const generateSampleData = (count: number = 250): OHLCVData[] => {
  const data: OHLCVData[] = [];
  let basePrice = 100;
  const startTime = Date.now() - count * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const volatility = 0.02;
    const trend = 0.0005;

    const randomChange = (Math.random() - 0.5) * volatility;
    const open = basePrice * (1 + trend + randomChange);

    const highChange = Math.random() * 0.01;
    const lowChange = Math.random() * 0.01;

    const high = open * (1 + highChange);
    const low = open * (1 - lowChange);

    const closeChange = (Math.random() - 0.5) * 0.015;
    const close = open * (1 + closeChange);

    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push({
      timestamp: startTime + i * 24 * 60 * 60 * 1000,
      open: Math.round(open * 100) / 100,
      high: Math.round(Math.max(open, high, close) * 100) / 100,
      low: Math.round(Math.min(open, low, close) * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: volume,
    });

    basePrice = close;
  }

  return data;
};

export default function Home() {
  // State management
  const [chartData, setChartData] = useState<OHLCVData[]>([]);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [bollingerOptions, setBollingerOptions] =
    useState<BollingerBandsOptions>(defaultBollingerOptions);
  const [bollingerStyle, setBollingerStyle] = useState<BollingerBandsStyle>(
    defaultBollingerStyle
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would load from your JSON file:
        // const response = await fetch('/data/ohlcv.json');
        // const data = await response.json();

        // For this demo, we'll generate sample data
        const data = generateSampleData(250);
        setChartData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to generated data
        const data = generateSampleData(250);
        setChartData(data);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle adding/removing Bollinger Bands
  const toggleBollingerBands = () => {
    setShowBollinger(!showBollinger);
  };

  // Handle opening settings
  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  // Handle closing settings
  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  // Handle options change
  const handleOptionsChange = (newOptions: BollingerBandsOptions) => {
    setBollingerOptions(newOptions);
  };

  // Handle style change
  const handleStyleChange = (newStyle: BollingerBandsStyle) => {
    setBollingerStyle(newStyle);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bollinger Bands Chart
          </h1>
          <p className="text-gray-400">
            Professional trading chart with Bollinger Bands indicator: <span className="text-white">By Aariz khan</span>
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={toggleBollingerBands}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showBollinger
                ? "bg-pink-800 hover:bg-pink-900 text-white"
                : "bg-indigo-700 hover:bg-indigo-800 text-white"
            }`}
          >
            {showBollinger ? "Remove Bollinger Bands" : "Add Bollinger Bands"}
          </button>

          {showBollinger && (
            <button
              onClick={openSettings}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
            >
              ⚙️ Settings
            </button>
          )}

          <div className="text-gray-400 text-sm">
            Data Points: {chartData.length} candles
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <Chart
            data={chartData}
            bollingerOptions={bollingerOptions}
            bollingerStyle={bollingerStyle}
            showBollinger={showBollinger}
          />
        </div>

        {/* Current Settings Display */}
        {showBollinger && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Current Bollinger Bands Settings
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Length:</span>
                <span className="text-white ml-2">
                  {bollingerOptions.length}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Source:</span>
                <span className="text-white ml-2 capitalize">
                  {bollingerOptions.source}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Std Dev:</span>
                <span className="text-white ml-2">
                  {bollingerOptions.stdDevMultiplier}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Offset:</span>
                <span className="text-white ml-2">
                  {bollingerOptions.offset}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            About Bollinger Bands
          </h3>
          <div className="text-gray-300 space-y-2">
            <p>
              Bollinger Bands are a technical analysis tool consisting of a
              center line (Simple Moving Average) and two price channels (bands)
              above and below it.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-blue-400">
                  Middle Band (Basis)
                </h4>
                <p className="text-sm">
                  Simple Moving Average of the closing prices
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-400">Upper Band</h4>
                <p className="text-sm">
                  Basis + (Standard Deviation × Multiplier)
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-400">Lower Band</h4>
                <p className="text-sm">
                  Basis - (Standard Deviation × Multiplier)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <BollingerSettings
          isOpen={isSettingsOpen}
          onClose={closeSettings}
          options={bollingerOptions}
          style={bollingerStyle}
          onOptionsChange={handleOptionsChange}
          onStyleChange={handleStyleChange}
        />
      </div>
    </div>
  );
}
