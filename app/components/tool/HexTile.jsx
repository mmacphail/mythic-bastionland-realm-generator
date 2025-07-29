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
        stroke="none"
        className={`hex-tile ${cursorClass} hover:opacity-80 transition-opacity`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => onHexMouseEnter && onHexMouseEnter(hex)}
        onMouseUp={() => onHexMouseUp && onHexMouseUp()}
        style={{ userSelect: 'none' }}
      />
      
      {/* Render holdings */}
      {holding && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          className="pointer-events-none select-none holding-symbol fill-gray-900 dark:fill-white"
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
          className="pointer-events-none select-none landmark-symbol fill-gray-900 dark:fill-white"
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
          className="pointer-events-none select-none myth-symbol fill-gray-900 dark:fill-white"
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
          className="pointer-events-none select-none fill-gray-600 dark:fill-gray-400"
        >
          {rowIndex},{colIndex}
        </text>
      )}
    </g>
  );
};

export default HexTile;
