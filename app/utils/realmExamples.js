import { Realm, HexTile } from './realmModel';
import { TerrainGenerator } from './realmGenerator';
import { terrainTypes } from './hexUtils';

/**
 * Example 1: Creating a basic realm
 */
export function createBasicRealm() {
  console.log('=== Creating Basic Realm ===');
  
  const realm = new Realm(8, 8);
  console.log('Realm created with dimensions:', realm.rows, 'x', realm.cols);
  
  // Set some specific terrain types
  realm.setHex(0, 0, terrainTypes.find(t => t.type === 'city'));
  realm.setHex(1, 1, terrainTypes.find(t => t.type === 'forest'));
  realm.setHex(2, 2, terrainTypes.find(t => t.type === 'mountain'));
  
  // Get terrain statistics
  const stats = realm.getTerrainStats();
  console.log('Terrain statistics:', stats);
  
  // Export and import example
  const exportedData = realm.export();
  const importedRealm = Realm.import(exportedData);
  console.log('Realm exported and imported successfully');
  
  return realm;
}

/**
 * Example 2: Random terrain generation
 */
export function generateRandomRealm() {
  console.log('=== Generating Random Realm ===');
  
  const realm = TerrainGenerator.generateRandomTerrain(10, 10);
  const stats = realm.getTerrainStats();
  
  console.log('Random realm stats:', stats);
  
  // Find all water hexes
  const waterHexes = realm.getHexesByTerrain('water');
  console.log('Water hexes found:', waterHexes.length);
  
  return realm;
}

/**
 * Example 3: Balanced terrain generation
 */
export function generateBalancedRealm() {
  console.log('=== Generating Balanced Realm ===');
  
  const realm = TerrainGenerator.generateBalancedTerrain(12, 12);
  const stats = realm.getTerrainStats();
  
  console.log('Balanced realm stats:', stats);
  
  // Verify that each terrain type appears at least once
  const hasAllTerrains = terrainTypes.every(terrain => stats[terrain.type] > 0);
  console.log('All terrain types present:', hasAllTerrains);
  
  return realm;
}

/**
 * Example 4: Weighted terrain generation
 */
export function generateWeightedRealm() {
  console.log('=== Generating Weighted Realm ===');
  
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
  
  const realm = TerrainGenerator.generateWeightedTerrain(12, 12, customWeights);
  const stats = realm.getTerrainStats();
  
  console.log('Weighted realm stats:', stats);
  
  return realm;
}

/**
 * Example 5: Clustered terrain generation
 */
export function generateClusteredRealm() {
  console.log('=== Generating Clustered Realm ===');
  
  const realm = TerrainGenerator.generateClusteredTerrain(15, 15);
  const stats = realm.getTerrainStats();
  
  console.log('Clustered realm stats:', stats);
  
  return realm;
}

/**
 * Example 6: Working with individual hex tiles
 */
export function workWithHexTiles() {
  console.log('=== Working with Hex Tiles ===');
  
  const realm = new Realm(5, 5);
  
  // Create a specific hex tile
  const centerHex = realm.getHex(2, 2);
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
  
  return realm;
}

/**
 * Example 7: Integration with HexGrid component format
 */
export function integrationExample() {
  console.log('=== Integration Example ===');
  
  // Create realm with random terrain
  const realm = TerrainGenerator.generateBalancedTerrain(6, 6);
  
  // Convert to HexGrid format
  const hexGridData = realm.toHexGridFormat();
  console.log('HexGrid format created');
  
  // Simulate some changes (like user clicking hexes)
  hexGridData[0][0] = terrainTypes.find(t => t.type === 'city');
  hexGridData[1][1] = terrainTypes.find(t => t.type === 'forest');
  
  // Update realm from changes
  realm.fromHexGridFormat(hexGridData);
  
  console.log('Realm updated from HexGrid format');
  console.log('Final stats:', realm.getTerrainStats());
  
  return realm;
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('Running all realm generator examples...\n');
  
  createBasicRealm();
  console.log('\n');
  
  generateRandomRealm();
  console.log('\n');
  
  generateBalancedRealm();
  console.log('\n');
  
  generateWeightedRealm();
  console.log('\n');
  
  generateClusteredRealm();
  console.log('\n');
  
  workWithHexTiles();
  console.log('\n');
  
  integrationExample();
  console.log('\n');
  
  console.log('All examples completed!');
}

// Uncomment to run examples when this file is imported
// runAllExamples();
