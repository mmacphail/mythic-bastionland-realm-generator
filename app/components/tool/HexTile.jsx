import { hexUtils } from '../../utils/hexUtils';

const HexTile = ({ hex, rowIndex, colIndex, hexSize, selectHex, selectedHex, paintingMode, onHexMouseDown, onHexMouseEnter, onHexMouseUp, landmark, holding, myth }) => {
  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
  
  // Change cursor based on mode
  const cursorClass = paintingMode ? 'cursor-crosshair' : 'cursor-pointer';
  
  const handleMouseDown = (e) => {
    if (paintingMode) {
      e.preventDefault(); // Prevent text selection and default drag behavior
      onHexMouseDown && onHexMouseDown(hex);
    }
  };

  const handleClick = () => {
    if (!paintingMode) {
      selectHex(hex);
    }
  };
  
  return (
    <g>
      <path
        d={hexPath}
        fill={hex.terrainType.color}
        stroke="#333"
        strokeWidth="1"
        className={`hex-tile ${cursorClass} hover:opacity-80 transition-opacity`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => onHexMouseEnter && onHexMouseEnter(hex)}
        onMouseUp={() => onHexMouseUp && onHexMouseUp()}
        style={{ userSelect: 'none' }}
      />
      
      {/* Selection overlay - only show when not in painting mode */}
      {selectedHex && !paintingMode && (
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
          y={y}
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
          y={y}
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
          y={y}
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
