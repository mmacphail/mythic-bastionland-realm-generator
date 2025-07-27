const HexPainter = ({ terrainTypes, paintingMode, selectedTerrainType, onStartPainting, onStopPainting }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Hex Painter</h3>
      
      <div className="space-y-2">
        {terrainTypes.map((terrain) => (
          <button
            key={terrain.type}
            onClick={() => onStartPainting(terrain)}
            className={`w-full text-left px-3 py-2 rounded border transition-colors text-gray-900 dark:text-white ${
              paintingMode && selectedTerrainType?.type === terrain.type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            className="w-full px-3 py-2 rounded border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-colors mt-4"
          >
            Stop Painting
          </button>
        )}
      </div>
      
      {paintingMode && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Paint Mode Active</p>
          <p>Click and drag on hexes to paint with {selectedTerrainType?.name}</p>
          <p className="text-xs mt-1 opacity-75">Tip: Hold mouse button and drag across multiple hexes</p>
        </div>
      )}
    </div>
  );
};

export default HexPainter;
