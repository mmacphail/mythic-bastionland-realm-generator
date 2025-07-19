const HexPainter = ({ terrainTypes, paintingMode, selectedTerrainType, onStartPainting, onStopPainting }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold mb-4">Hex Painter</h3>
      
      <div className="space-y-2">
        {terrainTypes.map((terrain) => (
          <button
            key={terrain.type}
            onClick={() => onStartPainting(terrain)}
            className={`w-full text-left px-3 py-2 rounded border transition-colors ${
              paintingMode && selectedTerrainType?.type === terrain.type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            style={{
              borderLeftColor: terrain.color,
              borderLeftWidth: '4px'
            }}
          >
            {terrain.name}
          </button>
        ))}
        
        {paintingMode && (
          <button
            onClick={onStopPainting}
            className="w-full px-3 py-2 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors mt-4"
          >
            Stop Painting
          </button>
        )}
      </div>
      
      {paintingMode && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
          <p className="font-medium">Paint Mode Active</p>
          <p>Click and drag on hexes to paint with {selectedTerrainType?.name}</p>
          <p className="text-xs mt-1 opacity-75">Tip: Hold mouse button and drag across multiple hexes</p>
        </div>
      )}
    </div>
  );
};

export default HexPainter;
