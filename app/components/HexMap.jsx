import HexTile from './HexTile';

const HexMap = ({ realm, svgWidth, svgHeight, hexSize, onHexClick }) => {
  const holdings = realm.getHoldings();
  const landmarks = realm.getLandmarks();
  
  return (
    <div className="hex-grid overflow-auto border border-gray-300 rounded-lg p-4">
      <svg 
        width={svgWidth} 
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="hex-grid-svg"
      >
        {realm.toHexGridFormat().map((row, rowIndex) =>
          row.map((hex, colIndex) => {
            const landmark = landmarks.find(l => l.row === rowIndex && l.col === colIndex);
            const holding = holdings.find(h => h.row === rowIndex && h.col === colIndex);
            
            return (
              <HexTile
                key={`${rowIndex}-${colIndex}`}
                hex={hex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                hexSize={hexSize}
                onHexClick={onHexClick}
                landmark={landmark}
                holding={holding}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};

export default HexMap;
