const RealmOverview = ({ realm }) => {
  const holdings = realm.getHoldings();
  const landmarks = realm.getLandmarks();
  const myths = realm.getMyths();
  
  // Create a grid to display all hexes with their contents
  const createHexGrid = () => {
    const hexGrid = [];
    for (let row = 0; row < realm.rows; row++) {
      for (let col = 0; col < realm.cols; col++) {
        const hex = realm.getHex(row, col);
        const holding = holdings.find(h => h.row === row && h.col === col);
        const landmark = landmarks.find(l => l.row === row && l.col === col);
        const myth = myths.find(m => m.row === row && m.col === col);
        
        // Only include hexes that have content (not empty terrain or have holdings/landmarks/myths)
        if (hex.terrainType.type !== 'empty' || holding || landmark || myth) {
          hexGrid.push({
            row,
            col,
            terrain: hex.terrainType,
            holding,
            landmark,
            myth
          });
        }
      }
    }
    return hexGrid;
  };

  const hexGrid = createHexGrid();
  
  // Group hexes into chunks of 12 for the 12-column layout
  const groupedHexes = [];
  for (let i = 0; i < hexGrid.length; i += 12) {
    groupedHexes.push(hexGrid.slice(i, i + 12));
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold mb-4">Realm Overview</h3>
      <div className="space-y-2">
        {groupedHexes.map((group, groupIndex) => (
          <div key={groupIndex} className="border-b border-gray-200 pb-2">
            {/* Top row: coordinates and terrain */}
            <div className="grid grid-cols-12 gap-1 text-sm">
              {group.map((hex, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-xs text-gray-500">
                    {hex.row},{hex.col}
                  </span>
                  <span className="text-xs">{hex.terrain.name}</span>
                </div>
              ))}
            </div>
            
            {/* Bottom row: holdings, landmarks, myths */}
            <div className="grid grid-cols-12 gap-1 text-xs text-gray-600 mt-1">
              {group.map((hex, index) => (
                <div key={index} className="space-y-1">
                  {hex.holding && (
                    <div className="text-blue-600 font-semibold">
                      <div>{hex.holding.isSeatOfPower ? 'Seat of Power' : 'Holding'}</div>
                      {hex.holding.name && hex.holding.name !== "Unknown" && (
                        <div className="text-blue-500 font-normal">{hex.holding.name}</div>
                      )}
                    </div>
                  )}
                  {hex.landmark && (
                    <div className="text-green-600">
                      {hex.landmark.type}: {hex.landmark.name}
                    </div>
                  )}
                  {hex.myth && (
                    <div className="text-purple-600">
                      Myth: {hex.myth.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {hexGrid.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-8">
            No content to display. Generate a realm or add content to hexes.
          </div>
        )}
      </div>
    </div>
  );
};

export default RealmOverview;
