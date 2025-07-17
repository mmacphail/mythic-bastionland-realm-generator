// Kingdom data model and random terrain generation utilities

import { terrainTypes } from './hexUtils';

/**
 * Represents a single hex tile in the kingdom
 */
export class HexTile {
  constructor(row, col, terrainType = terrainTypes[0]) {
    this.row = row;
    this.col = col;
    this.terrainType = terrainType;
    this.coordinates = { row, col };
  }

  /**
   * Get the terrain type of this hex
   */
  getTerrainType() {
    return this.terrainType;
  }

  /**
   * Set the terrain type of this hex
   */
  setTerrainType(terrainType) {
    this.terrainType = terrainType;
  }

  /**
   * Get the display color for this hex
   */
  getColor() {
    return this.terrainType.color;
  }

  /**
   * Get the display name for this hex
   */
  getName() {
    return this.terrainType.name;
  }

  /**
   * Convert hex tile to plain object for serialization
   */
  toJSON() {
    return {
      row: this.row,
      col: this.col,
      terrainType: this.terrainType,
      coordinates: this.coordinates
    };
  }

  /**
   * Create HexTile from plain object
   */
  static fromJSON(data) {
    return new HexTile(data.row, data.col, data.terrainType);
  }
}

/**
 * Represents the entire kingdom with a grid of hex tiles
 */
export class Kingdom {
  constructor(rows = 12, cols = 12) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.initializeGrid();
    this.metadata = {
      createdAt: new Date(),
      lastModified: new Date(),
      version: '1.0'
    };
  }

  /**
   * Initialize an empty grid with default terrain
   */
  initializeGrid() {
    const grid = [];
    for (let row = 0; row < this.rows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        grid[row][col] = new HexTile(row, col, terrainTypes[0]); // Default to 'empty'
      }
    }
    return grid;
  }

  /**
   * Get a hex tile at specific coordinates
   */
  getHex(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.grid[row][col];
    }
    return null;
  }

  /**
   * Set a hex tile at specific coordinates
   */
  setHex(row, col, terrainType) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.grid[row][col].setTerrainType(terrainType);
      this.metadata.lastModified = new Date();
    }
  }

  /**
   * Get all hexes of a specific terrain type
   */
  getHexesByTerrain(terrainType) {
    const hexes = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col].getTerrainType().type === terrainType) {
          hexes.push(this.grid[row][col]);
        }
      }
    }
    return hexes;
  }

  /**
   * Get terrain distribution statistics
   */
  getTerrainStats() {
    const stats = {};
    terrainTypes.forEach(terrain => {
      stats[terrain.type] = 0;
    });

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const terrainType = this.grid[row][col].getTerrainType().type;
        stats[terrainType]++;
      }
    }

    return stats;
  }

  /**
   * Convert kingdom to a format compatible with HexGrid component
   */
  toHexGridFormat() {
    const hexData = [];
    for (let row = 0; row < this.rows; row++) {
      hexData[row] = [];
      for (let col = 0; col < this.cols; col++) {
        hexData[row][col] = this.grid[row][col].getTerrainType();
      }
    }
    return hexData;
  }

  /**
   * Update kingdom from HexGrid format
   */
  fromHexGridFormat(hexData) {
    for (let row = 0; row < this.rows && row < hexData.length; row++) {
      for (let col = 0; col < this.cols && col < hexData[row].length; col++) {
        this.grid[row][col].setTerrainType(hexData[row][col]);
      }
    }
    this.metadata.lastModified = new Date();
  }

  /**
   * Export kingdom to JSON
   */
  export() {
    return {
      rows: this.rows,
      cols: this.cols,
      grid: this.grid.map(row => row.map(hex => hex.toJSON())),
      metadata: this.metadata
    };
  }

  /**
   * Import kingdom from JSON
   */
  static import(data) {
    const kingdom = new Kingdom(data.rows, data.cols);
    kingdom.metadata = data.metadata;
    
    for (let row = 0; row < data.rows; row++) {
      for (let col = 0; col < data.cols; col++) {
        kingdom.grid[row][col] = HexTile.fromJSON(data.grid[row][col]);
      }
    }
    
    return kingdom;
  }
}

/**
 * Random terrain generation utilities
 */
export class TerrainGenerator {
  /**
   * Generate completely random terrain
   */
  static generateRandomTerrain(rows = 12, cols = 12) {
    const kingdom = new Kingdom(rows, cols);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        kingdom.setHex(row, col, randomTerrain);
      }
    }
    
    return kingdom;
  }

  /**
   * Generate terrain ensuring each terrain type appears at least once
   */
  static generateBalancedTerrain(rows = 12, cols = 12) {
    const kingdom = new Kingdom(rows, cols);
    const totalHexes = rows * cols;
    const positions = [];
    
    // Create array of all possible positions
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({ row, col });
      }
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    let positionIndex = 0;
    
    // First, place at least one of each terrain type
    terrainTypes.forEach(terrain => {
      if (positionIndex < totalHexes) {
        const pos = positions[positionIndex];
        kingdom.setHex(pos.row, pos.col, terrain);
        positionIndex++;
      }
    });
    
    // Fill remaining positions with random terrain types
    while (positionIndex < totalHexes) {
      const pos = positions[positionIndex];
      const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
      kingdom.setHex(pos.row, pos.col, randomTerrain);
      positionIndex++;
    }
    
    return kingdom;
  }

  /**
   * Generate terrain with weighted distribution
   */
  static generateWeightedTerrain(rows = 12, cols = 12, weights = null) {
    const kingdom = new Kingdom(rows, cols);
    
    // Default weights favor more common terrain types
    const defaultWeights = {
      'empty': 0.1,
      'plains': 0.25,
      'forest': 0.2,
      'mountain': 0.15,
      'water': 0.15,
      'desert': 0.05,
      'swamp': 0.05,
      'city': 0.05
    };
    
    const terrainWeights = weights || defaultWeights;
    
    // Create weighted array
    const weightedTerrains = [];
    terrainTypes.forEach(terrain => {
      const weight = terrainWeights[terrain.type] || 0.1;
      const count = Math.floor(weight * 100); // Convert to integer for array repetition
      for (let i = 0; i < count; i++) {
        weightedTerrains.push(terrain);
      }
    });
    
    // Generate terrain
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const randomTerrain = weightedTerrains[Math.floor(Math.random() * weightedTerrains.length)];
        kingdom.setHex(row, col, randomTerrain);
      }
    }
    
    return kingdom;
  }

  /**
   * Generate terrain with clustered regions (more realistic)
   */
  static generateClusteredTerrain(rows = 12, cols = 12) {
    const kingdom = new Kingdom(rows, cols);
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    
    // Generate seed points for different terrain types
    const seedCount = Math.min(terrainTypes.length, Math.floor((rows * cols) / 8));
    const seeds = [];
    
    for (let i = 0; i < seedCount; i++) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const terrain = terrainTypes[i % terrainTypes.length];
      seeds.push({ row, col, terrain });
    }
    
    // Grow clusters from seed points
    seeds.forEach(seed => {
      const queue = [seed];
      const clusterSize = Math.floor(Math.random() * 8) + 3; // 3-10 hexes per cluster
      let grown = 0;
      
      while (queue.length > 0 && grown < clusterSize) {
        const current = queue.shift();
        
        if (current.row >= 0 && current.row < rows && 
            current.col >= 0 && current.col < cols && 
            !visited[current.row][current.col]) {
          
          visited[current.row][current.col] = true;
          kingdom.setHex(current.row, current.col, seed.terrain);
          grown++;
          
          // Add neighbors to queue with some probability
          const neighbors = [
            { row: current.row - 1, col: current.col },
            { row: current.row + 1, col: current.col },
            { row: current.row, col: current.col - 1 },
            { row: current.row, col: current.col + 1 }
          ];
          
          neighbors.forEach(neighbor => {
            if (Math.random() < 0.6) { // 60% chance to spread to neighbor
              queue.push({ ...neighbor, terrain: seed.terrain });
            }
          });
        }
      }
    });
    
    // Fill remaining unvisited hexes with random terrain
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!visited[row][col]) {
          const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
          kingdom.setHex(row, col, randomTerrain);
        }
      }
    }
    
    return kingdom;
  }
}

export default { Kingdom, HexTile, TerrainGenerator };
