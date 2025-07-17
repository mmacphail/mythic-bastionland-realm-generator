import { terrainTypes } from './hexUtils';
import { Realm, Hex } from './realmModel';

/**
 * Random terrain generation utilities
 */
export class TerrainGenerator {
  /**
   * Get available terrain types (excluding empty and city)
   */
  static getAvailableTerrains() {
    return terrainTypes.filter(terrain => 
      terrain.type !== 'empty' && terrain.type !== 'city'
    );
  }

  /**
   * Create a new realm with given dimensions
   */
  static createRealm(rows, cols) {
    return new Realm(rows, cols);
  }

  /**
   * Select a random terrain from available terrains
   */
  static selectRandomTerrain(availableTerrains) {
    return availableTerrains[Math.floor(Math.random() * availableTerrains.length)];
  }

  /**
   * Generate all possible positions for a grid
   */
  static generateAllPositions(rows, cols) {
    const positions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({ row, col });
      }
    }
    return positions;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Fill all hexes in a realm with random terrain
   */
  static fillWithRandomTerrain(realm, rows, cols, availableTerrains) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const randomTerrain = this.selectRandomTerrain(availableTerrains);
        realm.setHex(row, col, randomTerrain);
      }
    }
  }
  /**
   * Generate completely random terrain
   */
  static generateRandomTerrain(rows = 12, cols = 12) {
    const realm = this.createRealm(rows, cols);
    const availableTerrains = this.getAvailableTerrains();
    
    this.fillWithRandomTerrain(realm, rows, cols, availableTerrains);
    
    return realm;
  }

  /**
   * Generate terrain ensuring each terrain type appears at least once
   */
  static generateBalancedTerrain(rows = 12, cols = 12) {
    const realm = this.createRealm(rows, cols);
    const totalHexes = rows * cols;
    const availableTerrains = this.getAvailableTerrains();
    
    // Create and shuffle all possible positions
    const positions = this.shuffleArray(this.generateAllPositions(rows, cols));
    
    let positionIndex = 0;
    
    // First, place at least one of each terrain type
    availableTerrains.forEach(terrain => {
      if (positionIndex < totalHexes) {
        const pos = positions[positionIndex];
        realm.setHex(pos.row, pos.col, terrain);
        positionIndex++;
      }
    });
    
    // Fill remaining positions with random terrain types
    while (positionIndex < totalHexes) {
      const pos = positions[positionIndex];
      const randomTerrain = this.selectRandomTerrain(availableTerrains);
      realm.setHex(pos.row, pos.col, randomTerrain);
      positionIndex++;
    }
    
    return realm;
  }

  /**
   * Generate terrain with weighted distribution
   */
  static generateWeightedTerrain(rows = 12, cols = 12, weights = null) {
    const realm = this.createRealm(rows, cols);
    const availableTerrains = this.getAvailableTerrains();
    
    // Default weights favor more common terrain types
    const defaultWeights = {
      'plains': 0.35,
      'forest': 0.25,
      'mountain': 0.18,
      'water': 0.15,
      'desert': 0.04,
      'swamp': 0.03
    };
    
    const terrainWeights = weights || defaultWeights;
    
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
        const randomTerrain = this.selectRandomTerrain(weightedTerrains);
        realm.setHex(row, col, randomTerrain);
      }
    }
    
    return realm;
  }

  /**
   * Generate terrain with clustered regions (more realistic)
   */
  static generateClusteredTerrain(rows = 12, cols = 12) {
    const realm = this.createRealm(rows, cols);
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const availableTerrains = this.getAvailableTerrains();
    
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
          realm.setHex(current.row, current.col, seed.terrain);
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
          const randomTerrain = this.selectRandomTerrain(availableTerrains);
          realm.setHex(row, col, randomTerrain);
        }
      }
    }
    
    return realm;
  }
}

export default { Realm, Hex, TerrainGenerator };
