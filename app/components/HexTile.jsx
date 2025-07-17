import { hexUtils } from '../utils/hexUtils';

const HexTile = ({ hex, rowIndex, colIndex, hexSize, onHexClick }) => {
  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
  
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
    </g>
  );
};

export default HexTile;
