export interface OHLCVData {
  timestamp: number; // Unix timestamp
  open: number; // Opening price
  high: number; // Highest price
  low: number; // Lowest price
  close: number; // Closing price
  volume: number; // Trading volume
}

// Bollinger Bands calculation options
export interface BollingerBandsOptions {
  length: number; // Period for moving average (default: 20)
  source: "close" | "open" | "high" | "low"; // Price source (default: 'close')
  stdDevMultiplier: number; // Standard deviation multiplier (default: 2)
  offset: number; // Shift bands by N bars (default: 0)
  maType: "SMA"; // Moving average type (only SMA for this assignment)
}

// Style settings for each band
export interface BandStyle {
  visible: boolean; // Show/hide the band
  color: string; // Line color (hex format)
  lineWidth: number; // Line thickness in pixels
  lineStyle: "solid" | "dashed"; // Line style
}

// Complete style configuration
export interface BollingerBandsStyle {
  basis: BandStyle; // Middle band (moving average)
  upper: BandStyle; // Upper band
  lower: BandStyle; // Lower band
  fill: {
    // Background fill between upper and lower
    visible: boolean;
    opacity: number; // 0 to 1
    color: string;
  };
}

// Result of Bollinger Bands calculation for one data point
export interface BollingerBandsResult {
  basis: number; // Middle band value (SMA)
  upper: number; // Upper band value
  lower: number; // Lower band value
}
