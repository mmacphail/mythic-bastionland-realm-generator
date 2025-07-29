import HexTile from './HexTile';
import { hexUtils } from '../../utils/hexUtils';

const HexMap = ({ realm, svgWidth, svgHeight, hexSize, selectHex, selectedHex, paintingMode, onHexMouseDown, onHexMouseEnter, onHexMouseUp }) => {
  const holdings = realm.getHoldings();
  const landmarks = realm.getLandmarks();
  const myths = realm.getMyths();
  const barriers = realm.getBarriers();
  
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
            const hexBarriers = barriers.filter(b => b.row === rowIndex && b.col === colIndex);
            
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
                barriers={hexBarriers}
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
      </svg>
    </div>
  );
};

export default HexMap;
