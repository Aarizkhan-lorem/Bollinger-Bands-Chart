// components/BollingerSettings.tsx

"use client";

import React, { useState } from "react";
import { BollingerBandsOptions, BollingerBandsStyle } from "../lib/types";

interface BollingerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  options: BollingerBandsOptions;
  style: BollingerBandsStyle;
  onOptionsChange: (options: BollingerBandsOptions) => void;
  onStyleChange: (style: BollingerBandsStyle) => void;
}

const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  isOpen,
  onClose,
  options,
  style,
  onOptionsChange,
  onStyleChange,
}) => {
  const [activeTab, setActiveTab] = useState<"inputs" | "style">("inputs");

  if (!isOpen) return null;

  // Handle input changes
  const handleOptionChange = (key: keyof BollingerBandsOptions, value: any) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  // Handle style changes
  const handleStyleChange = (
    band: "basis" | "upper" | "lower" | "fill",
    property: string,
    value: any
  ) => {
    onStyleChange({
      ...style,
      [band]: {
        ...style[band],
        [property]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Bollinger Bands Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("inputs")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "inputs"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "style"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Style
          </button>
        </div>

        {/* Inputs Tab */}
        {activeTab === "inputs" && (
          <div className="space-y-4">
            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Length
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={options.length}
                onChange={(e) =>
                  handleOptionChange("length", parseInt(e.target.value) || 20)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* MA Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                MA Type
              </label>
              <select
                value={options.maType}
                onChange={(e) => handleOptionChange("maType", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SMA">SMA</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Source
              </label>
              <select
                value={options.source}
                onChange={(e) => handleOptionChange("source", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="close">Close</option>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* StdDev Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                StdDev (Multiplier)
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={options.stdDevMultiplier}
                onChange={(e) =>
                  handleOptionChange(
                    "stdDevMultiplier",
                    parseFloat(e.target.value) || 2
                  )
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Offset */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Offset
              </label>
              <input
                type="number"
                min="-50"
                max="50"
                value={options.offset}
                onChange={(e) =>
                  handleOptionChange("offset", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Style Tab */}
        {activeTab === "style" && (
          <div className="space-y-6">
            {/* Basis (Middle Band) */}
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">
                Basic (Middle Band)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={style.basis.visible}
                      onChange={(e) =>
                        handleStyleChange("basis", "visible", e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={style.basis.color}
                    onChange={(e) =>
                      handleStyleChange("basis", "color", e.target.value)
                    }
                    className="w-full h-8 rounded border border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Width
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={style.basis.lineWidth}
                    onChange={(e) =>
                      handleStyleChange(
                        "basis",
                        "lineWidth",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Style
                  </label>
                  <select
                    value={style.basis.lineStyle}
                    onChange={(e) =>
                      handleStyleChange("basis", "lineStyle", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upper Band */}
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">
                Upper Band
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={style.upper.visible}
                      onChange={(e) =>
                        handleStyleChange("upper", "visible", e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={style.upper.color}
                    onChange={(e) =>
                      handleStyleChange("upper", "color", e.target.value)
                    }
                    className="w-full h-8 rounded border border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Width
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={style.upper.lineWidth}
                    onChange={(e) =>
                      handleStyleChange(
                        "upper",
                        "lineWidth",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Style
                  </label>
                  <select
                    value={style.upper.lineStyle}
                    onChange={(e) =>
                      handleStyleChange("upper", "lineStyle", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lower Band */}
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">
                Lower Band
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={style.lower.visible}
                      onChange={(e) =>
                        handleStyleChange("lower", "visible", e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={style.lower.color}
                    onChange={(e) =>
                      handleStyleChange("lower", "color", e.target.value)
                    }
                    className="w-full h-8 rounded border border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Width
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={style.lower.lineWidth}
                    onChange={(e) =>
                      handleStyleChange(
                        "lower",
                        "lineWidth",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Line Style
                  </label>
                  <select
                    value={style.lower.lineStyle}
                    onChange={(e) =>
                      handleStyleChange("lower", "lineStyle", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Background Fill */}
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">
                Background Fill
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={style.fill.visible}
                      onChange={(e) =>
                        handleStyleChange("fill", "visible", e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={style.fill.color}
                    onChange={(e) =>
                      handleStyleChange("fill", "color", e.target.value)
                    }
                    className="w-full h-8 rounded border border-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">
                    Opacity: {(style.fill.opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={style.fill.opacity}
                    onChange={(e) =>
                      handleStyleChange(
                        "fill",
                        "opacity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-md hover:border-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BollingerSettings;
