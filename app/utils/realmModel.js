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
  constructor(row, col, isSeatOfPower = false) {
    this.row = row;
    this.col = col;
    this.isSeatOfPower = isSeatOfPower;
  }
}

/**
 * Represents the entire realm with a grid of hex tiles
 */
export class Realm {
  constructor(rows = 12, cols = 12) {
    this.rows = rows;
    this.cols = cols;
    this.holdings = [];
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

  addHolding(row, col, isSeatOfPower = false) {
    const holding = new Holding(row, col, isSeatOfPower);
    this.holdings.push(holding);
  }

  getHoldings() {
    return this.holdings;
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
   * Convert realm to a format compatible with HexGrid component
   */
  toHexGridFormat() {
    const hexData = [];
    for (let row = 0; row < this.rows; row++) {
      hexData[row] = [];
      for (let col = 0; col < this.cols; col++) {
        hexData[row][col] = this.hexMap[row][col].getTerrainType();
      }
    }
    return hexData;
  }

  /**
   * Update realm from HexGrid format
   */
  fromHexGridFormat(hexData) {
    for (let row = 0; row < this.rows && row < hexData.length; row++) {
      for (let col = 0; col < this.cols && col < hexData[row].length; col++) {
        this.hexMap[row][col].setTerrainType(hexData[row][col]);
      }
    }
    this.metadata.lastModified = new Date();
  }

  /**
   * Export realm to JSON
   */
  export() {
    return {
      rows: this.rows,
      cols: this.cols,
      grid: this.hexMap.map(row => row.map(hex => hex.toJSON())),
      metadata: this.metadata
    };
  }

  /**
   * Import realm from JSON
   */
  static import(data) {
    const realm = new Realm(data.rows, data.cols);
    realm.metadata = data.metadata;
    
    for (let row = 0; row < data.rows; row++) {
      for (let col = 0; col < data.cols; col++) {
        realm.hexMap[row][col] = Hex.fromJSON(data.hexMap[row][col]);
      }
    }
    
    return realm;
  }
}

export default { Realm, Hex };
