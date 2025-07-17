import React, { useState } from 'react';
import { terrainTypes, hexUtils } from '../utils/hexUtils';

const HexGrid = ({ rows = 12, cols = 12 }) => {
  const [hexData, setHexData] = useState(
    Array(rows).fill().map(() => Array(cols).fill({ ...terrainTypes[0] }))
  );

  // Hex dimensions
  const hexSize = 30;
  const hexWidth = hexSize * 2;
  const hexHeight = Math.sqrt(2.3) * hexSize; // Match the height from hexUtils
  
  // Calculate SVG dimensions based on proper hex grid layout
  const xSpacing = hexSize * 1.7; // Match the spacing from hexUtils
  const ySpacing = hexHeight; // Distance between hex centers vertically
  const svgWidth = cols * xSpacing + hexSize * 2; // Add extra space for rightmost hexes
  const svgHeight = rows * ySpacing + hexSize * 2;

  // Handle hex click
  const handleHexClick = (row, col) => {
    const newHexData = [...hexData];
    const currentHex = newHexData[row][col];
    
    // Cycle through terrain types
    const currentIndex = terrainTypes.findIndex(t => t.type === currentHex.type);
    const nextIndex = (currentIndex + 1) % terrainTypes.length;
    
    newHexData[row][col] = { ...terrainTypes[nextIndex] };
    setHexData(newHexData);
  };

  return (
    <div className="hex-grid-container">
      <div className="controls mb-4">
        <h2 className="text-2xl font-bold mb-2">Mythic Bastionland Realm Maker</h2>
        <p className="text-gray-600 mb-4">Click on hexes to cycle through terrain types</p>
        
        <div className="legend flex flex-wrap gap-2 mb-4">
          {terrainTypes.map((terrain, index) => (
            <div key={terrain.type} className="flex items-center gap-1">
              <div className="w-4 h-4 border" style={{ backgroundColor: terrain.color }}></div>
              <span className="text-sm">{terrain.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hex-grid overflow-auto border border-gray-300 rounded-lg p-4">
        <svg 
          width={svgWidth} 
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="hex-grid-svg"
        >
          {hexData.map((row, rowIndex) =>
            row.map((hex, colIndex) => {
              const { x, y } = hexUtils.hexToWorld(rowIndex, colIndex, hexSize);
              const hexPath = hexUtils.generateHexPath(x, y, hexSize);
              
              return (
                <g key={`${rowIndex}-${colIndex}`}>
                  <path
                    d={hexPath}
                    fill={hex.color}
                    stroke="#333"
                    strokeWidth="1"
                    className="hex-tile cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleHexClick(rowIndex, colIndex)}
                  />
                  {/* Coordinates for debugging - remove in production */}
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
            })
          )}
        </svg>
      </div>
    </div>
  );
};

export default HexGrid;
