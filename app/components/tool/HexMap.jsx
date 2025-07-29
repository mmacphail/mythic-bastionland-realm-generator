import HexTile from './HexTile';
import { hexUtils } from '../../utils/hexUtils';

const HexMap = ({ realm, svgWidth, svgHeight, hexSize, selectHex, selectedHex, paintingMode, onHexMouseDown, onHexMouseEnter, onHexMouseUp }) => {
  const holdings = realm.getHoldings();
  const landmarks = realm.getLandmarks();
  const myths = realm.getMyths();
  const barriers = realm.getBarriers();
  
  // Function to get the line coordinates for a barrier side
  const getBarrierLine = (x, y, side, hexSize) => {
    // Hexagon sides are numbered 1-6 starting from left going clockwise
    const sideAngles = [
      -Math.PI/3 * 2, // Side 1: left
      -Math.PI/3,     // Side 2: top-left  
      0,              // Side 3: top-right
      Math.PI/3,      // Side 4: right
      Math.PI/3 * 2,  // Side 5: bottom-right
      Math.PI         // Side 6: bottom-left
    ];
    
    const angle1 = sideAngles[side - 1] - Math.PI / 2;
    const angle2 = sideAngles[side % 6] - Math.PI / 2;
    
    const x1 = x + hexSize * Math.cos(angle1);
    const y1 = y + hexSize * Math.sin(angle1);
    const x2 = x + hexSize * Math.cos(angle2);
    const y2 = y + hexSize * Math.sin(angle2);
    
    return { x1, y1, x2, y2 };
  };
  
  return (
    <div className="hex-grid overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                paintingMode={paintingMode}
                onHexMouseDown={onHexMouseDown}
                onHexMouseEnter={onHexMouseEnter}
                onHexMouseUp={onHexMouseUp}
                landmark={landmark}
                holding={holding}
                myth={myth}
              />
            );
          })
        )}
        
        {/* Hex grid strokes - rendered on top of all hex tiles */}
        <g className="hex-strokes pointer-events-none">
          {realm.hexMap.map((row, rowIndex) =>
            row.map((hex, colIndex) => {
              const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
              const hexPath = hexUtils.generateHexPath(x, y, hexSize);
              
              return (
                <path
                  key={`stroke-${rowIndex}-${colIndex}`}
                  d={hexPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-600 dark:text-gray-400"
                />
              );
            })
          )}
        </g>
        
        {/* Selected hex overlay - rendered on top of strokes */}
        {selectedHex && !paintingMode && (
          <g className="selected-hex pointer-events-none">
            {realm.hexMap.map((row, rowIndex) =>
              row.map((hex, colIndex) => {
                if (hex === selectedHex) {
                  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
                  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
                  
                  return (
                    <path
                      key={`selected-${rowIndex}-${colIndex}`}
                      d={hexPath}
                      fill="rgba(255, 192, 203, 0.5)"
                      stroke="purple"
                      strokeWidth="3"
                      className="pointer-events-none"
                    />
                  );
                }
                return null;
              })
            )}
          </g>
        )}
        
        {/* Barriers - rendered on top of selection */}
        <g className="hex-barriers pointer-events-none">
          {barriers.map((barrier, index) => {
            const { x, y } = hexUtils.hexToWorld(barrier.row, barrier.col, hexSize);
            const { x1, y1, x2, y2 } = getBarrierLine(x, y, barrier.side, hexSize);
            
            return (
              <line
                key={`barrier-${barrier.row}-${barrier.col}-${barrier.side}-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="red"
                strokeWidth="4"
                className="pointer-events-none"
                opacity="0.8"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default HexMap;
