import HexTile from './HexTile';
import { hexUtils } from '../utils/hexUtils';

const HexMap = ({ realm, svgWidth, svgHeight, hexSize, onHexClick }) => {
  const holdings = realm.getHoldings();
  
  return (
    <div className="hex-grid overflow-auto border border-gray-300 rounded-lg p-4">
      <svg 
        width={svgWidth} 
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="hex-grid-svg"
      >
        {realm.toHexGridFormat().map((row, rowIndex) =>
          row.map((hex, colIndex) => (
            <HexTile
              key={`${rowIndex}-${colIndex}`}
              hex={hex}
              rowIndex={rowIndex}
              colIndex={colIndex}
              hexSize={hexSize}
              onHexClick={onHexClick}
            />
          ))
        )}
        
        {/* Render holdings */}
        {holdings.map((holding, index) => {
          const { x, y } = hexUtils.hexToWorld(holding.row, holding.col, hexSize);
          console.log(`Rendering holding at (${holding.row}, ${holding.col}) -> World coords: (${x}, ${y})`);
          return (
            <g key={`holding-${index}`}>
              {/* Castle/tower symbol for holdings */}
              <rect
                x={x - hexSize * 0.15}
                y={y - hexSize * 0.15}
                width={hexSize * 0.3}
                height={hexSize * 0.3}
                fill={holding.isSeatOfPower ? "#FFD700" : "#8B4513"}
                stroke="#000"
                strokeWidth="1"
                className="pointer-events-none"
              />
              {/* Crown symbol for seat of power */}
              {holding.isSeatOfPower && (
                <polygon
                  points={`${x - hexSize * 0.1},${y - hexSize * 0.2} ${x},${y - hexSize * 0.25} ${x + hexSize * 0.1},${y - hexSize * 0.2} ${x + hexSize * 0.08},${y - hexSize * 0.15} ${x - hexSize * 0.08},${y - hexSize * 0.15}`}
                  fill="#FFD700"
                  stroke="#000"
                  strokeWidth="0.5"
                  className="pointer-events-none"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default HexMap;
