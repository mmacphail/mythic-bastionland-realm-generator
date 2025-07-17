# Realm Data Model Documentation

This document explains the refactored realm data model structure for the Mythic Bastionland Realm Maker.

## File Structure

### `realmModel.js`
Contains the core data model classes:
- **`HexTile`** - Represents a single hex tile with coordinates and terrain type
- **`Realm`** - Represents the entire realm with a grid of hex tiles

### `realmGenerator.js` 
Contains terrain generation utilities:
- **`TerrainGenerator`** - Static class with methods for generating different types of terrain
- Re-exports `Realm` and `HexTile` for backward compatibility

### `realmExamples.js`
Contains example usage and demonstration code showing how to use the model and generator classes.

## Core Classes

### HexTile
Represents a single hex tile in the realm grid.

```javascript
import { HexTile } from './realmModel';

const hex = new HexTile(0, 0, terrainTypes[1]); // Create at row 0, col 0 with plains
hex.getTerrainType(); // Get current terrain
hex.setTerrainType(terrainTypes[2]); // Change to forest
hex.getColor(); // Get display color
hex.getName(); // Get display name
```

### Realm
Represents the entire realm with a grid of hex tiles.

```javascript
import { Realm } from './realmModel';

const realm = new Realm(12, 12); // Create 12x12 grid
realm.setHex(5, 5, terrainTypes[3]); // Set hex at (5,5) to mountain
const hex = realm.getHex(5, 5); // Get hex at coordinates
const stats = realm.getTerrainStats(); // Get terrain distribution
const hexGridData = realm.toHexGridFormat(); // Convert for HexGrid component
```

### TerrainGenerator
Static utility class for generating different types of terrain.

```javascript
import { TerrainGenerator } from './realmGenerator';

// Generate completely random terrain
const randomRealm = TerrainGenerator.generateRandomTerrain(12, 12);

// Generate balanced terrain (each type appears at least once)
const balancedRealm = TerrainGenerator.generateBalancedTerrain(12, 12);

// Generate clustered terrain (more realistic regions)
const clusteredRealm = TerrainGenerator.generateClusteredTerrain(12, 12);

// Generate weighted terrain (custom distribution)
const weightedRealm = TerrainGenerator.generateWeightedTerrain(12, 12, {
  'plains': 0.4,
  'forest': 0.3,
  'mountain': 0.2,
  'water': 0.1
});
```

## Key Features

### Data Model
- **Coordinate System**: Each hex has row/col coordinates
- **Terrain Types**: Each hex has one terrain type from the predefined list
- **Metadata**: Realm tracks creation time, last modified, and version
- **Serialization**: Full JSON export/import support

### Terrain Generation
- **Random**: Completely random terrain distribution
- **Balanced**: Ensures each terrain type appears at least once
- **Clustered**: Creates realistic terrain clusters/regions
- **Weighted**: Custom probability distribution for terrain types

### Integration
- **HexGrid Compatible**: Seamless integration with the existing HexGrid component
- **Backward Compatible**: All existing imports continue to work
- **Extensible**: Easy to add new terrain generation algorithms

## Usage in Components

The refactored model integrates seamlessly with the existing HexGrid component:

```javascript
import { Realm } from '../utils/realmModel';
import { TerrainGenerator } from '../utils/realmGenerator';

const [realm, setRealm] = useState(() => new Realm(rows, cols));
const [hexData, setHexData] = useState(() => realm.toHexGridFormat());

// Generate new terrain
const newRealm = TerrainGenerator.generateRandomTerrain(rows, cols);
setRealm(newRealm);
setHexData(newRealm.toHexGridFormat());
```

## Benefits of Refactoring

1. **Separation of Concerns**: Models are separated from generation logic
2. **Maintainability**: Easier to maintain and extend individual components
3. **Testability**: Each class can be tested independently
4. **Reusability**: Models can be used in other parts of the application
5. **Clean Architecture**: Clear distinction between data structures and algorithms
