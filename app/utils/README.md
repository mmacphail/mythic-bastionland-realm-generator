# Kingdom Data Model Documentation

This document explains the refactored kingdom data model structure for the Mythic Bastionland Realm Maker.

## File Structure

### `kingdomModel.js`
Contains the core data model classes:
- **`HexTile`** - Represents a single hex tile with coordinates and terrain type
- **`Kingdom`** - Represents the entire kingdom with a grid of hex tiles

### `kingdomGenerator.js` 
Contains terrain generation utilities:
- **`TerrainGenerator`** - Static class with methods for generating different types of terrain
- Re-exports `Kingdom` and `HexTile` for backward compatibility

### `kingdomExamples.js`
Contains example usage and demonstration code showing how to use the model and generator classes.

## Core Classes

### HexTile
Represents a single hex tile in the kingdom grid.

```javascript
import { HexTile } from './kingdomModel';

const hex = new HexTile(0, 0, terrainTypes[1]); // Create at row 0, col 0 with plains
hex.getTerrainType(); // Get current terrain
hex.setTerrainType(terrainTypes[2]); // Change to forest
hex.getColor(); // Get display color
hex.getName(); // Get display name
```

### Kingdom
Represents the entire kingdom with a grid of hex tiles.

```javascript
import { Kingdom } from './kingdomModel';

const kingdom = new Kingdom(12, 12); // Create 12x12 grid
kingdom.setHex(5, 5, terrainTypes[3]); // Set hex at (5,5) to mountain
const hex = kingdom.getHex(5, 5); // Get hex at coordinates
const stats = kingdom.getTerrainStats(); // Get terrain distribution
const hexGridData = kingdom.toHexGridFormat(); // Convert for HexGrid component
```

### TerrainGenerator
Static utility class for generating different types of terrain.

```javascript
import { TerrainGenerator } from './kingdomGenerator';

// Generate completely random terrain
const randomKingdom = TerrainGenerator.generateRandomTerrain(12, 12);

// Generate balanced terrain (each type appears at least once)
const balancedKingdom = TerrainGenerator.generateBalancedTerrain(12, 12);

// Generate clustered terrain (more realistic regions)
const clusteredKingdom = TerrainGenerator.generateClusteredTerrain(12, 12);

// Generate weighted terrain (custom distribution)
const weightedKingdom = TerrainGenerator.generateWeightedTerrain(12, 12, {
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
- **Metadata**: Kingdom tracks creation time, last modified, and version
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
import { Kingdom } from '../utils/kingdomModel';
import { TerrainGenerator } from '../utils/kingdomGenerator';

const [kingdom, setKingdom] = useState(() => new Kingdom(rows, cols));
const [hexData, setHexData] = useState(() => kingdom.toHexGridFormat());

// Generate new terrain
const newKingdom = TerrainGenerator.generateRandomTerrain(rows, cols);
setKingdom(newKingdom);
setHexData(newKingdom.toHexGridFormat());
```

## Benefits of Refactoring

1. **Separation of Concerns**: Models are separated from generation logic
2. **Maintainability**: Easier to maintain and extend individual components
3. **Testability**: Each class can be tested independently
4. **Reusability**: Models can be used in other parts of the application
5. **Clean Architecture**: Clear distinction between data structures and algorithms
