import { terrainTypes } from "../../utils/hexUtils";

const HexDetails = ({ realm, selectedHex, onTerrainChange }) => {
  const handleTerrainChange = (event) => {
    const newTerrainType = terrainTypes.find(t => t.type === event.target.value);
    if (selectedHex && newTerrainType) {
      onTerrainChange(selectedHex.row, selectedHex.col, newTerrainType);
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terrain Type
            </label>
            <select
              value={selectedHex.terrainType.type}
              onChange={handleTerrainChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {terrainTypes.map((terrain) => (
                <option key={terrain.type} value={terrain.type}>
                  {terrain.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terrain Color
            </label>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: selectedHex.terrainType.color }}
              ></div>
              <span className="text-sm text-gray-600">
                {selectedHex.terrainType.color}
              </span>
            </div>
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