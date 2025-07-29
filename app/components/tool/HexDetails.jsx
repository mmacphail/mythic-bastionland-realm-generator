import { useState } from "react";
import { terrainTypes } from "../../utils/hexUtils";
import {
  landmarkTypes,
  Holding,
  Landmark,
  Myth,
  Barrier,
} from "../../utils/realmModel";

const HexDetails = ({
  realm,
  selectedHex,
  onTerrainChange,
  onAddHolding,
  onUpdateHolding,
  onRemoveHolding,
  onAddLandmark,
  onUpdateLandmark,
  onRemoveLandmark,
  onAddMyth,
  onUpdateMyth,
  onRemoveMyth,
  onAddBarrier,
  onRemoveBarrier,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTerrainChange = (terrainType) => {
    if (selectedHex && terrainType) {
      onTerrainChange(selectedHex.row, selectedHex.col, terrainType);
      setIsDropdownOpen(false);
    }
  };

  // Get feature for the selected hex
  const getHexFeature = () => {
    if (!selectedHex || !realm) return null;

    const holding = realm
      .getHoldings()
      .find((h) => h.row === selectedHex.row && h.col === selectedHex.col);
    if (holding) return { type: "holding", data: holding };

    const landmark = realm
      .getLandmarks()
      .find((l) => l.row === selectedHex.row && l.col === selectedHex.col);
    if (landmark) return { type: "landmark", data: landmark };

    const myth = realm
      .getMyths()
      .find((m) => m.row === selectedHex.row && m.col === selectedHex.col);
    if (myth) return { type: "myth", data: myth };

    return null;
  };

  const hexFeature = getHexFeature();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Hex Details
      </h3>
      {selectedHex ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coordinates
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Row: {selectedHex.row}, Col: {selectedHex.col}
            </p>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Terrain Type
            </label>

            {/* Custom dropdown button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: selectedHex.terrainType.color }}
                ></div>
                <span>{selectedHex.terrainType.name}</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Custom dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {terrainTypes.map((terrain) => (
                  <button
                    key={terrain.type}
                    onClick={() => handleTerrainChange(terrain)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <div
                      className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: terrain.color }}
                    ></div>
                    <span>{terrain.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feature Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feature
            </label>
            {hexFeature ? (
              <div className="space-y-2">
                {hexFeature.type === "holding" && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        Holding
                      </span>
                      <button
                        onClick={() =>
                          onRemoveHolding(selectedHex.row, selectedHex.col)
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={hexFeature.data.name}
                          onChange={(e) =>
                            onUpdateHolding(
                              selectedHex.row,
                              selectedHex.col,
                              hexFeature.data.isSeatOfPower,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Holding name"
                        />
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={hexFeature.data.isSeatOfPower}
                          onChange={(e) =>
                            onUpdateHolding(
                              selectedHex.row,
                              selectedHex.col,
                              e.target.checked,
                              hexFeature.data.name
                            )
                          }
                          className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          Seat of Power
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {hexFeature.type === "landmark" && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        Landmark
                      </span>
                      <button
                        onClick={() =>
                          onRemoveLandmark(selectedHex.row, selectedHex.col)
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Type
                        </label>
                        <select
                          value={hexFeature.data.type}
                          onChange={(e) =>
                            onUpdateLandmark(
                              selectedHex.row,
                              selectedHex.col,
                              e.target.value,
                              hexFeature.data.name
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {landmarkTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={hexFeature.data.name}
                          onChange={(e) =>
                            onUpdateLandmark(
                              selectedHex.row,
                              selectedHex.col,
                              hexFeature.data.type,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Landmark name"
                        />
                      </div>
                      {hexFeature.data.seer && (
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Seer
                          </label>

                          <input
                            type="text"
                            value={hexFeature.data.seer}
                            onChange={(e) =>
                              onUpdateLandmark(
                                selectedHex.row,
                                selectedHex.col,
                                hexFeature.data.type,
                                hexFeature.data.name,
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Landmark seer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {hexFeature.type === "myth" && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        Myth
                      </span>
                      <button
                        onClick={() =>
                          onRemoveMyth(selectedHex.row, selectedHex.col)
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={hexFeature.data.name}
                        onChange={(e) =>
                          onUpdateMyth(
                            selectedHex.row,
                            selectedHex.col,
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Myth name"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No feature on this hex
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      onAddHolding(selectedHex.row, selectedHex.col)
                    }
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    + Holding
                  </button>
                  <button
                    onClick={() =>
                      onAddLandmark(selectedHex.row, selectedHex.col)
                    }
                    className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    + Landmark
                  </button>
                  <button
                    onClick={() => onAddMyth(selectedHex.row, selectedHex.col)}
                    className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
                  >
                    + Myth
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Barriers Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Barriers
            </label>
            {(() => {
              const hexBarriers = realm
                .getBarriers()
                .filter(
                  (b) => b.row === selectedHex.row && b.col === selectedHex.col
                );

              const sideLabels = {
                1: "Left",
                2: "Top Left",
                3: "Top Right",
                4: "Right",
                5: "Bottom Right",
                6: "Bottom Left",
              };

              return (
                <div className="space-y-2">
                  {hexBarriers.length > 0 ? (
                    <div className="space-y-1">
                      {hexBarriers.map((barrier, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md"
                        >
                          <span className="text-sm text-gray-900 dark:text-white">
                            {(() => {
                              return sideLabels[barrier.side];
                            })()}
                          </span>
                          <button
                            onClick={() =>
                              onRemoveBarrier(
                                selectedHex.row,
                                selectedHex.col,
                                barrier.side
                              )
                            }
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No barriers on this hex
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((side) => {
                      const hasBarrier = hexBarriers.some(
                        (b) => b.side === side
                      );
                      return (
                        <button
                          key={side}
                          onClick={() =>
                            !hasBarrier &&
                            onAddBarrier(selectedHex.row, selectedHex.col, side)
                          }
                          disabled={hasBarrier}
                          className={`px-2 py-1 text-xs rounded ${
                            hasBarrier
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                          }`}
                          title={`${
                            hasBarrier
                              ? "Barrier already exists on"
                              : "Add barrier to"
                          } ${sideLabels[side].toLowerCase()} side`}
                        >
                          + {sideLabels[side]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select a hex on the map to view its details
        </p>
      )}
    </div>
  );
};

export default HexDetails;
