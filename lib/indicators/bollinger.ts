// lib/indicators/bollinger.ts

import {
  OHLCVData,
  BollingerBandsOptions,
  BollingerBandsResult,
} from "../types";

/**
 * Calculate Simple Moving Average (SMA)
 * @param values - Array of numbers
 * @param length - Period for the average
 * @returns SMA value or NaN if not enough data
 */
function calculateSMA(values: number[], length: number): number {
  if (values.length < length) {
    return NaN; // Not enough data points
  }

  const sum = values.slice(-length).reduce((acc, val) => acc + val, 0);
  return sum / length;
}

/**
 * Calculate Standard Deviation (using sample standard deviation)
 * @param values - Array of numbers
 * @param length - Period for calculation
 * @param mean - Pre-calculated mean (optional, will calculate if not provided)
 * @returns Standard deviation or NaN if not enough data
 */
function calculateStandardDeviation(
  values: number[],
  length: number,
  mean?: number
): number {
  if (values.length < length) {
    return NaN;
  }

  const slice = values.slice(-length);
  const avg =
    mean !== undefined
      ? mean
      : slice.reduce((sum, val) => sum + val, 0) / length;

  // Calculate variance (sum of squared differences from mean)
  const variance =
    slice.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (length - 1); // Sample std dev (n-1)

  return Math.sqrt(variance);
}

/**
 * Extract price values from OHLCV data based on source
 * @param data - OHLCV data array
 * @param source - Price source ('open', 'high', 'low', 'close')
 * @returns Array of price values
 */
function extractPriceValues(
  data: OHLCVData[],
  source: BollingerBandsOptions["source"]
): number[] {
  return data.map((candle) => candle[source]);
}

/**
 * Apply offset to shift indicator values
 * @param values - Array of indicator results
 * @param offset - Number of positions to shift (positive = forward, negative = backward)
 * @returns Shifted array with NaN padding
 */
function applyOffset<T>(values: T[], offset: number): T[] {
  if (offset === 0) return values;

  const result = new Array(values.length);

  if (offset > 0) {
    // Shift forward: pad beginning with NaN
    for (let i = 0; i < offset && i < values.length; i++) {
      result[i] = NaN as any;
    }
    for (let i = offset; i < values.length; i++) {
      result[i] = values[i - offset];
    }
  } else {
    // Shift backward: pad end with NaN
    const absOffset = Math.abs(offset);
    for (let i = 0; i < values.length - absOffset; i++) {
      result[i] = values[i + absOffset];
    }
    for (let i = values.length - absOffset; i < values.length; i++) {
      result[i] = NaN as any;
    }
  }

  return result;
}

/**
 * Calculate Bollinger Bands for given OHLCV data
 * @param data - Array of OHLCV candles
 * @param options - Bollinger Bands configuration
 * @returns Array of Bollinger Bands results (same length as input data)
 */
export function computeBollingerBands(
  data: OHLCVData[],
  options: BollingerBandsOptions
): BollingerBandsResult[] {
  const { length, source, stdDevMultiplier, offset } = options;

  // Extract price values based on source
  const prices = extractPriceValues(data, source);

  // Calculate Bollinger Bands for each data point
  const results: BollingerBandsResult[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      // Not enough data points for calculation
      results.push({
        basis: NaN,
        upper: NaN,
        lower: NaN,
      });
    } else {
      // Get the slice of prices for calculation
      const priceSlice = prices.slice(0, i + 1);

      // Calculate basis (SMA)
      const basis = calculateSMA(priceSlice, length);

      // Calculate standard deviation
      const stdDev = calculateStandardDeviation(priceSlice, length, basis);

      // Calculate upper and lower bands
      const upper = basis + stdDevMultiplier * stdDev;
      const lower = basis - stdDevMultiplier * stdDev;

      results.push({
        basis,
        upper,
        lower,
      });
    }
  }

  // Apply offset if specified
  if (offset !== 0) {
    return applyOffset(results, offset);
  }

  return results;
}

/**
 * Default Bollinger Bands options
 */
export const defaultBollingerOptions: BollingerBandsOptions = {
  length: 20,
  source: "close",
  stdDevMultiplier: 2,
  offset: 0,
  maType: "SMA",
};

/**
 * Validate Bollinger Bands options
 * @param options - Options to validate
 * @returns Validated options with defaults applied
 */
export function validateBollingerOptions(
  options: Partial<BollingerBandsOptions>
): BollingerBandsOptions {
  return {
    length: Math.max(
      1,
      Math.floor(options.length || defaultBollingerOptions.length)
    ),
    source: options.source || defaultBollingerOptions.source,
    stdDevMultiplier: Math.max(
      0.1,
      options.stdDevMultiplier || defaultBollingerOptions.stdDevMultiplier
    ),
    offset: Math.floor(options.offset || defaultBollingerOptions.offset),
    maType: "SMA", // Only SMA supported for this assignment
  };
}
