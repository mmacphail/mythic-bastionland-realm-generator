import { useState } from "react";
import { terrainTypes } from "../../utils/hexUtils";

const HexDetails = ({ realm, selectedHex, onTerrainChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTerrainChange = (terrainType) => {
    if (selectedHex && terrainType) {
      onTerrainChange(selectedHex.row, selectedHex.col, terrainType);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-300">
      <h3 className="text-lg font-semibold mb-3">Hex Details</h3>
      {selectedHex ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordinates
            </label>
            <p className="text-sm text-gray-600">
              Row: {selectedHex.row}, Col: {selectedHex.col}
            </p>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terrain Type
            </label>
            
            {/* Custom dropdown button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: selectedHex.terrainType.color }}
                ></div>
                <span>{selectedHex.terrainType.name}</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Custom dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {terrainTypes.map((terrain) => (
                  <button
                    key={terrain.type}
                    onClick={() => handleTerrainChange(terrain)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center space-x-2"
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
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Select a hex on the map to view its details
        </p>
      )}
    </div>
  );
};

export default HexDetails;