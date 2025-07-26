export const exportRealm = (realm) => {
  // Sanitize realm name for filename
  const sanitizeFilename = (name) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  // Create export data structure
  const exportData = {
    name: realm.name,
    rows: realm.rows,
    cols: realm.cols,
    terrain: [],
    holdings: realm.holdings || [],
    landmarks: realm.landmarks || [],
    myths: realm.myths || []
  };

  // Export all terrain data
  for (let row = 0; row < realm.rows; row++) {
    for (let col = 0; col < realm.cols; col++) {
      const hex = realm.getHex(row, col);
      if (hex && hex.terrainType) {
        exportData.terrain.push({
          row: row,
          col: col,
          type: hex.terrainType.type
        });
      }
    }
  }

  // Convert to JSON
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(realm.name)}.json`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};