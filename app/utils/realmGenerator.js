import { terrainTypes } from "./hexUtils";
import { Realm, Hex, landmarkTypes } from "./realmModel";
import landmarksData from "../data/landmarks.json";
import mythsData from "../data/myths.json";
import seersData from "../data/seers.json";

const pickedLandmarks = new Set();
const pickedSeers = new Set();
const pickedMyths = new Set();

export function pickRandomLandmarkType() {
  const availableTypes = Object.keys(landmarksData);
  return availableTypes[Math.floor(Math.random() * availableTypes.length)];
}

export function pickRandomLandmark(type) {
  const options = landmarksData[type];
  const availableOptions = options.filter(option => !pickedLandmarks.has(option));
  
  // If all options have been picked, reset the set and use all options
  if (availableOptions.length === 0) {
    pickedLandmarks.clear();
    availableOptions.push(...options);
  }
  
  const selectedLandmark = availableOptions[Math.floor(Math.random() * availableOptions.length)];
  pickedLandmarks.add(selectedLandmark);
  return selectedLandmark;
}

export function pickRandomSeer() {
  const availableSeers = seersData.filter(seer => !pickedSeers.has(seer));
  
  // If all seers have been picked, reset the set and use all seers
  if (availableSeers.length === 0) {
    pickedSeers.clear();
    availableSeers.push(...seersData);
  }
  
  const selectedSeer = availableSeers[Math.floor(Math.random() * availableSeers.length)];
  pickedSeers.add(selectedSeer);
  return selectedSeer;
}

export function pickRandomMyth() {
  const availableMyths = mythsData.filter(myth => !pickedMyths.has(myth));
  
  // If all myths have been picked, reset the set and use all myths
  if (availableMyths.length === 0) {
    pickedMyths.clear();
    availableMyths.push(...mythsData);
  }
  
  const selectedMyth = availableMyths[Math.floor(Math.random() * availableMyths.length)];
  pickedMyths.add(selectedMyth);
  return selectedMyth;
}

export class RealmGenerator {
  static realmDimensions = { rows: 12, cols: 12 };

  static createRealm() {
    return new Realm(
      RealmGenerator.realmDimensions.rows,
      RealmGenerator.realmDimensions.cols
    );
  }

  static generateRealm(terrainStrategy) {
    const realm = this.createRealm();
    RealmGenerator.generateTerrain(realm, terrainStrategy);
    
    // Generate features in order of strictest constraints first
    RealmGenerator.generateHoldings(realm);    // Holdings first (most restrictive)
    RealmGenerator.generateLandmarks(realm);   // Landmarks second 
    RealmGenerator.generateMyths(realm);       // Myths last (depends on holdings)
    
    return realm;
  }

  static pickRandomLocation() {
    const row = Math.floor(Math.random() * RealmGenerator.realmDimensions.rows);
    const col = Math.floor(Math.random() * RealmGenerator.realmDimensions.cols);
    return { row, col };
  }

  /**
   * Calculate hex distance between two positions
   * Uses proper hexagonal grid distance calculation
   */
  static calculateHexDistance(pos1, pos2) {
    // Convert rectangular coordinates to hex coordinates
    // For offset coordinates (odd-r layout), we need to adjust
    const col1 = pos1.col - Math.floor((pos1.row - (pos1.row % 2)) / 2);
    const col2 = pos2.col - Math.floor((pos2.row - (pos2.row % 2)) / 2);
    
    const dx = col1 - col2;
    const dy = pos1.row - pos2.row;
    const dz = -dx - dy;
    
    // Hex distance is the maximum of the absolute values
    return Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
  }

  /**
   * Check if a position has any feature (holding, landmark, or myth)
   */
  static hasFeatureAtPosition(realm, row, col) {
    const hasHolding = realm.holdings.some(h => h.row === row && h.col === col);
    const hasLandmark = realm.landmarks.some(l => l.row === row && l.col === col);
    const hasMyth = realm.myths.some(m => m.row === row && m.col === col);
    return hasHolding || hasLandmark || hasMyth;
  }

  /**
   * Check if a position is valid for a holding
   */
  static isValidHoldingPosition(realm, row, col) {
    // Rule 1: No feature at this location
    if (this.hasFeatureAtPosition(realm, row, col)) {
      return false;
    }

    // Rule 2: Holdings must be at least 3 hexes from each other
    for (const holding of realm.holdings) {
      const distance = this.calculateHexDistance({ row, col }, { row: holding.row, col: holding.col });
      if (distance < 3) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if a position is valid for a landmark
   */
  static isValidLandmarkPosition(realm, row, col) {
    // Rule 1: No feature at this location
    if (this.hasFeatureAtPosition(realm, row, col)) {
      return false;
    }

    // Rule 2: Landmarks must be at least 1 hex from any other feature
    const allFeatures = [
      ...realm.holdings.map(h => ({ row: h.row, col: h.col })),
      ...realm.landmarks.map(l => ({ row: l.row, col: l.col })),
      ...realm.myths.map(m => ({ row: m.row, col: m.col }))
    ];

    for (const feature of allFeatures) {
      const distance = this.calculateHexDistance({ row, col }, feature);
      if (distance <= 1) { // Changed from < 1 to <= 1 to ensure at least 1 hex distance
        return false;
      }
    }

    return true;
  }

  /**
   * Check if a position is valid for a myth
   */
  static isValidMythPosition(realm, row, col) {
    // Rule 1: No feature at this location
    if (this.hasFeatureAtPosition(realm, row, col)) {
      return false;
    }

    // Rule 2: Myths must be at least 3 hexes from holdings
    for (const holding of realm.holdings) {
      const distance = this.calculateHexDistance({ row, col }, { row: holding.row, col: holding.col });
      if (distance < 3) {
        return false;
      }
    }

    // Rule 3: Myths must be at least 3 hexes from other myths
    for (const myth of realm.myths) {
      const distance = this.calculateHexDistance({ row, col }, { row: myth.row, col: myth.col });
      if (distance < 3) {
        return false;
      }
    }

    return true;
  }

  /**
   * Find a valid position with multiple attempts
   */
  static findValidPosition(realm, validationFn, maxAttempts = 100) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { row, col } = this.pickRandomLocation();
      if (validationFn(realm, row, col)) {
        return { row, col };
      }
    }
    return null; // Could not find valid position
  }

  static generateHoldings(realm, count = 4) {
    for (let i = 0; i < count; i++) {
      const position = this.findValidPosition(realm, this.isValidHoldingPosition.bind(this));
      if (position) {
        const isSeatOfPower = i === 0;
        realm.addHolding(position.row, position.col, isSeatOfPower, "Unknown");
      } else {
        console.warn(`Could not place holding ${i + 1} due to placement constraints`);
      }
    }
  }

  static generateLandmarks(realm, count = 4) {
    for (const type of landmarkTypes) {
      for (let i = 0; i < count; i++) {
        const position = this.findValidPosition(realm, this.isValidLandmarkPosition.bind(this));
        if (position) {
          const label = pickRandomLandmark(type);
          const seer = type === "Sanctum" ? pickRandomSeer() : null;
          realm.addLandmark(position.row, position.col, type, label, seer);
        } else {
          console.warn(`Could not place ${type} landmark ${i + 1} due to placement constraints`);
        }
      }
    }
  }

  static generateMyths(realm, count = 6) {
    for (let i = 0; i < count; i++) {
      const position = this.findValidPosition(realm, this.isValidMythPosition.bind(this));
      if (position) {
        const name = pickRandomMyth();
        realm.addMyth(position.row, position.col, name);
      } else {
        console.warn(`Could not place myth ${i + 1} due to placement constraints`);
      }
    }
  }

  static generateTerrain(realm, terrainStrategy) {
    if(terrainStrategy === "random") {
      return this.generateRandomTerrain(realm);
    } else if(terrainStrategy === "balanced") {
      return this.generateBalancedTerrain(realm);
    } else if(terrainStrategy === "clustered") {
      return this.generateClusteredTerrain(realm);
    } else if(terrainStrategy === "weighted") {
      return this.generateWeightedTerrain(realm);
    }
  }

  static generateRandomTerrain(realm) {
    return TerrainGenerator.generateRandomTerrain(
      realm,
      RealmGenerator.realmDimensions.rows,
      RealmGenerator.realmDimensions.cols
    );
  }

  static generateBalancedTerrain(realm) {
    return TerrainGenerator.generateBalancedTerrain(
      realm,
      RealmGenerator.realmDimensions.rows,
      RealmGenerator.realmDimensions.cols
    );
  }

  static generateWeightedTerrain(realm) {
    return TerrainGenerator.generateWeightedTerrain(
      realm,
      RealmGenerator.realmDimensions.rows,
      RealmGenerator.realmDimensions.cols
    );
  }

  static generateClusteredTerrain(realm) {
    return TerrainGenerator.generateClusteredTerrain(
      realm,
      RealmGenerator.realmDimensions.rows,
      RealmGenerator.realmDimensions.cols
    );
  }
}

/**
 * Random terrain generation utilities
 */
export class TerrainGenerator {
  /**
   * Get available terrain types (excluding empty and city)
   */
  static getAvailableTerrains() {
    return terrainTypes.filter(
      (terrain) => terrain.type !== "empty" && terrain.type !== "city"
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
    return availableTerrains[
      Math.floor(Math.random() * availableTerrains.length)
    ];
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
  static generateRandomTerrain(realm, rows = 12, cols = 12) {
    const availableTerrains = this.getAvailableTerrains();

    this.fillWithRandomTerrain(realm, rows, cols, availableTerrains);

    return realm;
  }

  /**
   * Generate terrain ensuring each terrain type appears at least once
   */
  static generateBalancedTerrain(realm, rows = 12, cols = 12) {
    const totalHexes = rows * cols;
    const availableTerrains = this.getAvailableTerrains();

    // Create and shuffle all possible positions
    const positions = this.shuffleArray(this.generateAllPositions(rows, cols));

    let positionIndex = 0;

    // First, place at least one of each terrain type
    availableTerrains.forEach((terrain) => {
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
  static generateWeightedTerrain(realm, rows = 12, cols = 12, weights = null) {
    const availableTerrains = this.getAvailableTerrains();

    // Default weights favor more common terrain types
    const defaultWeights = {
      plains: 0.35,
      forest: 0.25,
      mountain: 0.18,
      water: 0.15,
      desert: 0.04,
      swamp: 0.03,
    };

    const terrainWeights = weights || defaultWeights;

    // Create weighted array
    const weightedTerrains = [];
    availableTerrains.forEach((terrain) => {
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
  static generateClusteredTerrain(realm, rows = 12, cols = 12) {
    const visited = Array(rows)
      .fill()
      .map(() => Array(cols).fill(false));
    const availableTerrains = this.getAvailableTerrains();

    // Generate seed points for different terrain types
    const seedCount = Math.min(
      availableTerrains.length,
      Math.floor((rows * cols) / 8)
    );
    const seeds = [];

    for (let i = 0; i < seedCount; i++) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const terrain = availableTerrains[i % availableTerrains.length];
      seeds.push({ row, col, terrain });
    }

    // Grow clusters from seed points
    seeds.forEach((seed) => {
      const queue = [seed];
      const clusterSize = Math.floor(Math.random() * 8) + 3; // 3-10 hexes per cluster
      let grown = 0;

      while (queue.length > 0 && grown < clusterSize) {
        const current = queue.shift();

        if (
          current.row >= 0 &&
          current.row < rows &&
          current.col >= 0 &&
          current.col < cols &&
          !visited[current.row][current.col]
        ) {
          visited[current.row][current.col] = true;
          realm.setHex(current.row, current.col, seed.terrain);
          grown++;

          // Add neighbors to queue with some probability
          const neighbors = [
            { row: current.row - 1, col: current.col },
            { row: current.row + 1, col: current.col },
            { row: current.row, col: current.col - 1 },
            { row: current.row, col: current.col + 1 },
          ];

          neighbors.forEach((neighbor) => {
            if (Math.random() < 0.6) {
              // 60% chance to spread to neighbor
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
