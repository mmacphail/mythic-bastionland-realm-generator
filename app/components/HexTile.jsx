import { hexUtils } from '../utils/hexUtils';

const HexTile = ({ hex, rowIndex, colIndex, hexSize, onHexClick, landmarks = [], holdings = [] }) => {
  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
  
  // Find landmarks at this position
  const landmarksAtPosition = landmarks.filter(landmark => 
    landmark.row === rowIndex && landmark.col === colIndex
  );
  
  // Find holdings at this position
  const holdingsAtPosition = holdings.filter(holding => 
    holding.row === rowIndex && holding.col === colIndex
  );
  
  return (
    <g>
      <path
        d={hexPath}
        fill={hex.color}
        stroke="#333"
        strokeWidth="1"
        className="hex-tile cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onHexClick(rowIndex, colIndex)}
      />
      
      {/* Render holdings */}
      {holdingsAtPosition.length > 0 && (
        <text
          x={x}
          y={y - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#000"
          className="pointer-events-none select-none holding-symbol"
          style={{ fontWeight: 'bold' }}
        >
          {holdingsAtPosition.some(holding => holding.isSeatOfPower) ? 'S' : 'H'}
        </text>
      )}
      
      {/* Render landmarks */}
      {landmarksAtPosition.length > 0 && (
        <text
          x={x}
          y={y + (holdingsAtPosition.length > 0 ? 8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#000"
          className="pointer-events-none select-none landmark-symbol"
          style={{ fontWeight: 'bold' }}
        >
          L
        </text>
      )}
      
      {/* Coordinates text (only show if no landmarks or holdings) */}
      {landmarksAtPosition.length === 0 && holdingsAtPosition.length === 0 && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="#333"
          className="pointer-events-none select-none"
        >
          {rowIndex},{colIndex}
        </text>
      )}
    </g>
  );
};

export default HexTile;
