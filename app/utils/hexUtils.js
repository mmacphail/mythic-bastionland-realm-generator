// Utility functions for hex grid operations

export const terrainTypes = [
  { type: "empty", color: "#f0f0f0", name: "Empty" },
  { type: "plains", color: "#90EE90", name: "Plains" },
  { type: "forest", color: "#228B22", name: "Forest" },
  { type: "mountain", color: "#8B4513", name: "Mountain" },
  { type: "water", color: "#4682B4", name: "Water" },
  { type: "desert", color: "#F4A460", name: "Desert" },
  { type: "swamp", color: "#556B2F", name: "Swamp" },
  { type: "city", color: "#696969", name: "City" },
];

// Centralized hex configuration
export const hexConfig = {
  defaultSize: 30,
  heightMultiplier: 2,
  xSpacingMultiplier: Math.sqrt(3),
  ySpacingMultiplier: 1.5,

  // Calculate derived values
  getHexHeight: (hexSize = hexConfig.defaultSize) =>
    hexSize * hexConfig.heightMultiplier,
  getXSpacing: (hexSize = hexConfig.defaultSize) =>
    hexSize * hexConfig.xSpacingMultiplier,
  getYSpacing: (hexSize = hexConfig.defaultSize) =>
    hexSize * hexConfig.ySpacingMultiplier,

  // Calculate SVG dimensions
  getSvgDimensions: (rows, cols, hexSize = hexConfig.defaultSize) => {
    const xSpacing = hexConfig.getXSpacing(hexSize);
    const ySpacing = hexConfig.getYSpacing(hexSize);
    return {
      width: cols * xSpacing + hexSize * 2,
      height: rows * ySpacing + hexSize * 2,
    };
  },
};

export const hexUtils = {
  hexToWorld: (row, col, hexSize = hexConfig.defaultSize) => {
    const xSpacing = hexConfig.getXSpacing(hexSize);
    const ySpacing = hexConfig.getYSpacing(hexSize);

    // Calculate position with proper offset for alternating rows
    const x = col * xSpacing + (row % 2) * (xSpacing / 2) + hexSize;
    const y = row * ySpacing + hexSize;

    return { x, y };
  },

  generateHexPath: (x, y, hexSize) => {
    const points = [];
    // Start from top and go clockwise
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2; // Start from top (-90 degrees)
      const pointX = x + hexSize * Math.cos(angle);
      const pointY = y + hexSize * Math.sin(angle);
      points.push(`${pointX},${pointY}`);
    }
    return `M ${points.join(" L ")} Z`;
  },

  getNeighbors: (row, col, maxRows, maxCols) => {
    const neighbors = [];
    const isEvenRow = row % 2 === 0;

    const directions = isEvenRow
      ? [
          [-1, -1],
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
        ]
      : [
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, 0],
          [1, 1],
        ];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
        neighbors.push({ row: newRow, col: newCol });
      }
    });

    return neighbors;
  },

  hexDistance: (row1, col1, row2, col2) => {
    const toCube = (row, col) => {
      const x = col - (row - (row & 1)) / 2;
      const z = row;
      const y = -x - z;
      return { x, y, z };
    };

    const cube1 = toCube(row1, col1);
    const cube2 = toCube(row2, col2);

    return (
      (Math.abs(cube1.x - cube2.x) +
        Math.abs(cube1.y - cube2.y) +
        Math.abs(cube1.z - cube2.z)) /
      2
    );
  },

  exportGrid: (hexData) => {
    return JSON.stringify(hexData, null, 2);
  },

  importGrid: (jsonData) => {
    try {
      return JSON.parse(jsonData);
    } catch (error) {
      console.error("Error importing grid data:", error);
      return null;
    }
  },
};

export default hexUtils;
