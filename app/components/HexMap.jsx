import HexTile from './HexTile';

const HexMap = ({ realm, svgWidth, svgHeight, hexSize, selectHex, selectedHex  }) => {
  const holdings = realm.getHoldings();
  const landmarks = realm.getLandmarks();
  const myths = realm.getMyths();
  
  return (
    <div className="hex-grid overflow-auto border border-gray-300 rounded-lg p-4">
      <svg 
        width={svgWidth} 
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="hex-grid-svg"
      >
        {realm.hexMap.map((row, rowIndex) =>
          row.map((hex, colIndex) => {
            const landmark = landmarks.find(l => l.row === rowIndex && l.col === colIndex);
            const holding = holdings.find(h => h.row === rowIndex && h.col === colIndex);
            const myth = myths.find(m => m.row === rowIndex && m.col === colIndex);
            
            return (
              <HexTile
                key={`${rowIndex}-${colIndex}`}
                hex={hex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                hexSize={hexSize}
                selectHex={selectHex}
                selectedHex={selectedHex}
                landmark={landmark}
                holding={holding}
                myth={myth}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};

export default HexMap;
