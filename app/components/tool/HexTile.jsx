import { hexUtils } from '../../utils/hexUtils';

const HexTile = ({ hex, rowIndex, colIndex, hexSize, selectHex, paintingMode, onHexMouseDown, onHexMouseEnter, onHexMouseUp, landmark, holding, myth, barriers = [] }) => {
  const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
  const hexPath = hexUtils.generateHexPath(x, y, hexSize);
  
  // Function to get the line coordinates for a barrier side
  const getBarrierLine = (side) => {
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
      
      {/* Render barriers */}
      {barriers.map((barrier, index) => {
        const { x1, y1, x2, y2 } = getBarrierLine(barrier.side);
        return (
          <line
            key={index}
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
  );
};

export default HexTile;
