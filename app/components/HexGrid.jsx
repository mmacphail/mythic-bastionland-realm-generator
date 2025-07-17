import React, { useState } from 'react';
import { terrainTypes, hexUtils, hexConfig } from '../utils/hexUtils';
import { Kingdom } from '../utils/kingdomModel';
import { TerrainGenerator } from '../utils/kingdomGenerator';

const HexGrid = ({ rows = 12, cols = 12 }) => {
  const [kingdom, setKingdom] = useState(() => new Kingdom(rows, cols));
  const [hexData, setHexData] = useState(() => kingdom.toHexGridFormat());

  const hexSize = hexConfig.defaultSize;
  const { width: svgWidth, height: svgHeight } = hexConfig.getSvgDimensions(rows, cols, hexSize);

  const handleHexClick = (row, col) => {
    const newHexData = [...hexData];
    const currentHex = newHexData[row][col];
    
    const currentIndex = terrainTypes.findIndex(t => t.type === currentHex.type);
    const nextIndex = (currentIndex + 1) % terrainTypes.length;
    
    newHexData[row][col] = { ...terrainTypes[nextIndex] };
    setHexData(newHexData);
    
    // Update kingdom model
    kingdom.setHex(row, col, terrainTypes[nextIndex]);
    setKingdom(kingdom);
  };

  const generateRandomTerrain = () => {
    const newKingdom = TerrainGenerator.generateRandomTerrain(rows, cols);
    setKingdom(newKingdom);
    setHexData(newKingdom.toHexGridFormat());
  };

  const generateBalancedTerrain = () => {
    const newKingdom = TerrainGenerator.generateBalancedTerrain(rows, cols);
    setKingdom(newKingdom);
    setHexData(newKingdom.toHexGridFormat());
  };

  const generateClusteredTerrain = () => {
    const newKingdom = TerrainGenerator.generateClusteredTerrain(rows, cols);
    setKingdom(newKingdom);
    setHexData(newKingdom.toHexGridFormat());
  };

  const generateWeightedTerrain = () => {
    const newKingdom = TerrainGenerator.generateWeightedTerrain(rows, cols);
    setKingdom(newKingdom);
    setHexData(newKingdom.toHexGridFormat());
  };

  const clearTerrain = () => {
    const newKingdom = new Kingdom(rows, cols);
    setKingdom(newKingdom);
    setHexData(newKingdom.toHexGridFormat());
  };

  const getTerrainStats = () => {
    return kingdom.getTerrainStats();
  };

  return (
    <div className="hex-grid-container">
      <div className="controls mb-4">
        <h2 className="text-2xl font-bold mb-2">Mythic Bastionland Realm Maker</h2>
        <p className="text-gray-600 mb-4">Click on hexes to cycle through terrain types</p>
        
        <div className="generation-controls mb-4">
          <h3 className="text-lg font-semibold mb-2">Terrain Generation</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={generateRandomTerrain}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Random
            </button>
            <button 
              onClick={generateBalancedTerrain}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Balanced
            </button>
            <button 
              onClick={generateClusteredTerrain}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Clustered
            </button>
            <button 
              onClick={generateWeightedTerrain}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Weighted
            </button>
            <button 
              onClick={clearTerrain}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="legend flex flex-wrap gap-2 mb-4">
          <div className="mr-4">
            <h4 className="font-semibold mb-1">Terrain Types:</h4>
            <div className="flex flex-wrap gap-2">
              {terrainTypes.map((terrain, index) => (
                <div key={terrain.type} className="flex items-center gap-1">
                  <div className="w-4 h-4 border" style={{ backgroundColor: terrain.color }}></div>
                  <span className="text-sm">{terrain.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Statistics:</h4>
            <div className="text-sm">
              {Object.entries(getTerrainStats()).map(([type, count]) => (
                <span key={type} className="mr-2">
                  {terrainTypes.find(t => t.type === type)?.name}: {count}
                </span>
              ))}
            </div>
          </div>
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
