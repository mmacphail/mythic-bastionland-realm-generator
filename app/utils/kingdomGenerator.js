import { terrainTypes } from './hexUtils';
import { Kingdom, HexTile } from './kingdomModel';

/**
 * Random terrain generation utilities
 */
export class TerrainGenerator {
  /**
   * Generate completely random terrain
   */
  static generateRandomTerrain(rows = 12, cols = 12) {
    const kingdom = new Kingdom(rows, cols);
    
    // Filter out empty and city terrain types
    const availableTerrains = terrainTypes.filter(terrain => 
      terrain.type !== 'empty' && terrain.type !== 'city'
    );
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const randomTerrain = availableTerrains[Math.floor(Math.random() * availableTerrains.length)];
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
    
    // Filter out empty and city terrain types
    const availableTerrains = terrainTypes.filter(terrain => 
      terrain.type !== 'empty' && terrain.type !== 'city'
    );
    
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
    
    // First, place at least one of each terrain type (except empty and city)
    availableTerrains.forEach(terrain => {
      if (positionIndex < totalHexes) {
        const pos = positions[positionIndex];
        kingdom.setHex(pos.row, pos.col, terrain);
        positionIndex++;
      }
    });
    
    // Fill remaining positions with random terrain types
    while (positionIndex < totalHexes) {
      const pos = positions[positionIndex];
      const randomTerrain = availableTerrains[Math.floor(Math.random() * availableTerrains.length)];
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
    
    // Default weights favor more common terrain types (excluding empty and city)
    const defaultWeights = {
      'plains': 0.35,
      'forest': 0.25,
      'mountain': 0.18,
      'water': 0.15,
      'desert': 0.04,
      'swamp': 0.03
    };
    
    const terrainWeights = weights || defaultWeights;
    
    // Filter out empty and city terrain types
    const availableTerrains = terrainTypes.filter(terrain => 
      terrain.type !== 'empty' && terrain.type !== 'city'
    );
    
    // Create weighted array
    const weightedTerrains = [];
    availableTerrains.forEach(terrain => {
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
    
    // Filter out empty and city terrain types
    const availableTerrains = terrainTypes.filter(terrain => 
      terrain.type !== 'empty' && terrain.type !== 'city'
    );
    
    // Generate seed points for different terrain types
    const seedCount = Math.min(availableTerrains.length, Math.floor((rows * cols) / 8));
    const seeds = [];
    
    for (let i = 0; i < seedCount; i++) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const terrain = availableTerrains[i % availableTerrains.length];
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
          const randomTerrain = availableTerrains[Math.floor(Math.random() * availableTerrains.length)];
          kingdom.setHex(row, col, randomTerrain);
        }
      }
    }
    
    return kingdom;
  }
}

export default { Kingdom, HexTile, TerrainGenerator };
