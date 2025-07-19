import { useState } from "react";
import { terrainTypes } from "../../utils/hexUtils";
import { landmarkTypes, Holding, Landmark, Myth } from "../../utils/realmModel";

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
  onRemoveMyth
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
    
    const holding = realm.getHoldings().find(h => h.row === selectedHex.row && h.col === selectedHex.col);
    if (holding) return { type: 'holding', data: holding };
    
    const landmark = realm.getLandmarks().find(l => l.row === selectedHex.row && l.col === selectedHex.col);
    if (landmark) return { type: 'landmark', data: landmark };
    
    const myth = realm.getMyths().find(m => m.row === selectedHex.row && m.col === selectedHex.col);
    if (myth) return { type: 'myth', data: myth };
    
    return null;
  };

  const hexFeature = getHexFeature();

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

          {/* Feature Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feature
            </label>
            {hexFeature ? (
              <div className="space-y-2">
                {hexFeature.type === 'holding' && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Holding</span>
                      <button 
                        onClick={() => onRemoveHolding(selectedHex.row, selectedHex.col)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={hexFeature.data.name}
                          onChange={(e) => onUpdateHolding(selectedHex.row, selectedHex.col, hexFeature.data.isSeatOfPower, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Holding name"
                        />
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={hexFeature.data.isSeatOfPower}
                          onChange={(e) => onUpdateHolding(selectedHex.row, selectedHex.col, e.target.checked, hexFeature.data.name)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Seat of Power</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {hexFeature.type === 'landmark' && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Landmark</span>
                      <button 
                        onClick={() => onRemoveLandmark(selectedHex.row, selectedHex.col)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Type</label>
                        <select
                          value={hexFeature.data.type}
                          onChange={(e) => onUpdateLandmark(selectedHex.row, selectedHex.col, e.target.value, hexFeature.data.name)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          {landmarkTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={hexFeature.data.name}
                          onChange={(e) => onUpdateLandmark(selectedHex.row, selectedHex.col, hexFeature.data.type, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Landmark name"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {hexFeature.type === 'myth' && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Myth</span>
                      <button 
                        onClick={() => onRemoveMyth(selectedHex.row, selectedHex.col)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={hexFeature.data.name}
                        onChange={(e) => onUpdateMyth(selectedHex.row, selectedHex.col, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Myth name"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">No feature on this hex</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAddHolding(selectedHex.row, selectedHex.col)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    + Holding
                  </button>
                  <button
                    onClick={() => onAddLandmark(selectedHex.row, selectedHex.col)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    + Landmark
                  </button>
                  <button
                    onClick={() => onAddMyth(selectedHex.row, selectedHex.col)}
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    + Myth
                  </button>
                </div>
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