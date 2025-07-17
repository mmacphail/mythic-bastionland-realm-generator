// Example usage of the Kingdom data model and terrain generation
// This file demonstrates how to use the new kingdomGenerator utilities

import { Kingdom, HexTile } from './kingdomModel';
import { TerrainGenerator } from './kingdomGenerator';
import { terrainTypes } from './hexUtils';

/**
 * Example 1: Creating a basic kingdom
 */
export function createBasicKingdom() {
  console.log('=== Creating Basic Kingdom ===');
  
  const kingdom = new Kingdom(8, 8);
  console.log('Kingdom created with dimensions:', kingdom.rows, 'x', kingdom.cols);
  
  // Set some specific terrain types
  kingdom.setHex(0, 0, terrainTypes.find(t => t.type === 'city'));
  kingdom.setHex(1, 1, terrainTypes.find(t => t.type === 'forest'));
  kingdom.setHex(2, 2, terrainTypes.find(t => t.type === 'mountain'));
  
  // Get terrain statistics
  const stats = kingdom.getTerrainStats();
  console.log('Terrain statistics:', stats);
  
  // Export and import example
  const exportedData = kingdom.export();
  const importedKingdom = Kingdom.import(exportedData);
  console.log('Kingdom exported and imported successfully');
  
  return kingdom;
}

/**
 * Example 2: Random terrain generation
 */
export function generateRandomKingdom() {
  console.log('=== Generating Random Kingdom ===');
  
  const kingdom = TerrainGenerator.generateRandomTerrain(10, 10);
  const stats = kingdom.getTerrainStats();
  
  console.log('Random kingdom stats:', stats);
  
  // Find all water hexes
  const waterHexes = kingdom.getHexesByTerrain('water');
  console.log('Water hexes found:', waterHexes.length);
  
  return kingdom;
}

/**
 * Example 3: Balanced terrain generation
 */
export function generateBalancedKingdom() {
  console.log('=== Generating Balanced Kingdom ===');
  
  const kingdom = TerrainGenerator.generateBalancedTerrain(12, 12);
  const stats = kingdom.getTerrainStats();
  
  console.log('Balanced kingdom stats:', stats);
  
  // Verify that each terrain type appears at least once
  const hasAllTerrains = terrainTypes.every(terrain => stats[terrain.type] > 0);
  console.log('All terrain types present:', hasAllTerrains);
  
  return kingdom;
}

/**
 * Example 4: Weighted terrain generation
 */
export function generateWeightedKingdom() {
  console.log('=== Generating Weighted Kingdom ===');
  
  // Custom weights favoring forests and plains
  const customWeights = {
    'empty': 0.05,
    'plains': 0.35,
    'forest': 0.3,
    'mountain': 0.1,
    'water': 0.1,
    'desert': 0.05,
    'swamp': 0.03,
    'city': 0.02
  };
  
  const kingdom = TerrainGenerator.generateWeightedTerrain(12, 12, customWeights);
  const stats = kingdom.getTerrainStats();
  
  console.log('Weighted kingdom stats:', stats);
  
  return kingdom;
}

/**
 * Example 5: Clustered terrain generation
 */
export function generateClusteredKingdom() {
  console.log('=== Generating Clustered Kingdom ===');
  
  const kingdom = TerrainGenerator.generateClusteredTerrain(15, 15);
  const stats = kingdom.getTerrainStats();
  
  console.log('Clustered kingdom stats:', stats);
  
  return kingdom;
}

/**
 * Example 6: Working with individual hex tiles
 */
export function workWithHexTiles() {
  console.log('=== Working with Hex Tiles ===');
  
  const kingdom = new Kingdom(5, 5);
  
  // Create a specific hex tile
  const centerHex = kingdom.getHex(2, 2);
  console.log('Center hex coordinates:', centerHex.coordinates);
  console.log('Center hex terrain:', centerHex.getName());
  
  // Change terrain type
  centerHex.setTerrainType(terrainTypes.find(t => t.type === 'city'));
  console.log('Changed center hex to:', centerHex.getName());
  
  // Convert to JSON
  const hexJson = centerHex.toJSON();
  console.log('Hex as JSON:', hexJson);
  
  // Create from JSON
  const newHex = HexTile.fromJSON(hexJson);
  console.log('Recreated hex:', newHex.getName());
  
  return kingdom;
}

/**
 * Example 7: Integration with HexGrid component format
 */
export function integrationExample() {
  console.log('=== Integration Example ===');
  
  // Create kingdom with random terrain
  const kingdom = TerrainGenerator.generateBalancedTerrain(6, 6);
  
  // Convert to HexGrid format
  const hexGridData = kingdom.toHexGridFormat();
  console.log('HexGrid format created');
  
  // Simulate some changes (like user clicking hexes)
  hexGridData[0][0] = terrainTypes.find(t => t.type === 'city');
  hexGridData[1][1] = terrainTypes.find(t => t.type === 'forest');
  
  // Update kingdom from changes
  kingdom.fromHexGridFormat(hexGridData);
  
  console.log('Kingdom updated from HexGrid format');
  console.log('Final stats:', kingdom.getTerrainStats());
  
  return kingdom;
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('Running all kingdom generator examples...\n');
  
  createBasicKingdom();
  console.log('\n');
  
  generateRandomKingdom();
  console.log('\n');
  
  generateBalancedKingdom();
  console.log('\n');
  
  generateWeightedKingdom();
  console.log('\n');
  
  generateClusteredKingdom();
  console.log('\n');
  
  workWithHexTiles();
  console.log('\n');
  
  integrationExample();
  console.log('\n');
  
  console.log('All examples completed!');
}

// Uncomment to run examples when this file is imported
// runAllExamples();
