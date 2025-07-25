import { terrainTypes } from './hexUtils';

/**
 * Represents a single hex tile in the realm
 */
export class Hex {
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

  static fromJSON(data) {
    return new Hex(data.row, data.col, data.terrainType);
  }
}

export class Holding {
  constructor(row, col, isSeatOfPower = false, name = "Unknown") {
    this.row = row;
    this.col = col;
    this.isSeatOfPower = isSeatOfPower;
    this.name = name;
  }
}

export class Myth {
  constructor(row, col, name) {
    this.row = row;
    this.col = col;
    this.name = name;
  }
}

export const landmarkTypes = [
  "Dwelling", "Sanctum", "Monument", "Hazard", "Curse", "Ruin"
];

export class Landmark {
  constructor(row, col, type, name, seer) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.name = name;
    this.seer = seer || null;
  }

  static fromJSON(data) {
    return new Landmark(data.row, data.col, data.type, data.name, data.seer);
  }
}

/**
 * Represents the entire realm with a grid of hex tiles
 */
export class Realm {
  constructor(rows = 12, cols = 12, name = "My Realm") {
    this.rows = rows;
    this.cols = cols;
    this.name = name;
    this.holdings = [];
    this.landmarks = [];
    this.myths = [];
    this.hexMap = this.initializeHexMap();
    this.metadata = {
      createdAt: new Date(),
      lastModified: new Date(),
      version: '1.0'
    };
  }

  /**
   * Initialize an empty grid with default terrain
   */
  initializeHexMap() {
    const hexMap = [];
    for (let row = 0; row < this.rows; row++) {
      hexMap[row] = [];
      for (let col = 0; col < this.cols; col++) {
        hexMap[row][col] = new Hex(row, col, terrainTypes[0]); // Default to 'empty'
      }
    }
    return hexMap;
  }

  /**
   * Get a hex tile at specific coordinates
   */
  getHex(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.hexMap[row][col];
    }
    return null;
  }

  /**
   * Set a hex tile at specific coordinates
   */
  setHex(row, col, terrainType) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.hexMap[row][col].setTerrainType(terrainType);
      this.metadata.lastModified = new Date();
    }
  }

  addHolding(row, col, isSeatOfPower = false, name = "Unknown") {
    const holding = new Holding(row, col, isSeatOfPower, name);
    this.holdings.push(holding);
  }

  getHoldings() {
    return this.holdings;
  }

  addLandmark(row, col, type, name, seer = null) {
    const landmark = new Landmark(row, col, type, name, seer);
    this.landmarks.push(landmark);
  }

  getLandmarks() {
    return this.landmarks;
  }

  addMyth(row, col, name) {
    const myth = new Myth(row, col, name);
    this.myths.push(myth);
  }

  getMyths() {
    return this.myths;
  }

  /**
   * Get all hexes of a specific terrain type
   */
  getHexesByTerrain(terrainType) {
    const hexes = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.hexMap[row][col].getTerrainType().type === terrainType) {
          hexes.push(this.hexMap[row][col]);
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
        const terrainType = this.hexMap[row][col].getTerrainType().type;
        stats[terrainType]++;
      }
    }

    return stats;
  }

  /**
   * Export realm to JSON
   */
  export() {
    return {
      rows: this.rows,
      cols: this.cols,
      name: this.name,
      grid: this.hexMap.map(row => row.map(hex => hex.toJSON())),
      holdings: this.holdings,
      landmarks: this.landmarks,
      myths: this.myths,
      metadata: this.metadata
    };
  }

  /**
   * Import realm from JSON
   */
  static import(data) {
    const realm = new Realm(data.rows, data.cols, data.name);
    realm.metadata = data.metadata;
    
    for (let row = 0; row < data.rows; row++) {
      for (let col = 0; col < data.cols; col++) {
        realm.hexMap[row][col] = Hex.fromJSON(data.hexMap[row][col]);
      }
    }
    
    // Import holdings, landmarks, and myths if they exist
    if (data.holdings) {
      realm.holdings = data.holdings.map(h => new Holding(h.row, h.col, h.isSeatOfPower, h.name));
    }
    if (data.landmarks) {
      realm.landmarks = data.landmarks.map(l => new Landmark(l.row, l.col, l.type, l.name));
    }
    if (data.myths) {
      realm.myths = data.myths.map(m => new Myth(m.row, m.col, m.name));
    }
    
    return realm;
  }

  copy() {
    const newRealm = new Realm(this.rows, this.cols);
    
    // Deep copy the hexMap array
    newRealm.hexMap = this.hexMap.map(row => 
      row.map(hex => new Hex(hex.row, hex.col, hex.terrainType))
    );
    
    newRealm.holdings = [...this.holdings];
    newRealm.landmarks = [...this.landmarks];
    newRealm.myths = [...this.myths];
    newRealm.metadata = { ...this.metadata, lastModified: new Date() };
    return newRealm;
  }
}

export default { Realm, Hex };
