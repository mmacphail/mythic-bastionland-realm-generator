import { hexUtils } from '../utils/hexUtils';

const HexTile = ({ hex, rowIndex, colIndex, hexSize, selectHex, selectedHex, landmark, holding, myth }) => {
  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
  
  return (
    <g>
      <path
        d={hexPath}
        fill={hex.terrainType.color}
        stroke="#333"
        strokeWidth="1"
        className="hex-tile cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => selectHex(hex)}
      />
      
      {/* Selection overlay */}
      {selectedHex && (
        <path
          d={hexPath}
          fill="rgba(255, 192, 203, 0.5)"
          stroke="red"
          strokeWidth="3"
          className="pointer-events-none"
        />
      )}
      
      {/* Render holdings */}
      {holding && (
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
          {holding.isSeatOfPower ? 'S' : 'H'}
        </text>
      )}
      
      {/* Render landmarks */}
      {landmark && (
        <text
          x={x}
          y={y + (holding ? 8 : 0)}
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
      
      {/* Render myths */}
      {myth && (
        <text
          x={x}
          y={y + (holding ? 8 : 0) + (landmark ? 8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#000"
          className="pointer-events-none select-none myth-symbol"
          style={{ fontWeight: 'bold' }}
        >
          M
        </text>
      )}
      
      {/* Coordinates text (only show if no landmarks, holdings, or myths) */}
      {!landmark && !holding && !myth && (
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
