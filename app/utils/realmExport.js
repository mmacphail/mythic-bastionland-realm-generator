import { terrainTypes } from "./hexUtils";
import { Realm } from "./realmModel";

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

export const importRealm = (file, onSuccess, onError) => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const importData = JSON.parse(event.target.result);
      
      // Validate import data structure
      if (!validateRealmData(importData)) {
        throw new Error('Invalid realm data structure');
      }
      
      // Create new realm from imported data
      const realm = createRealmFromImportData(importData);
      
      onSuccess(realm);
    } catch (error) {
      onError(`Failed to import realm: ${error.message}`);
    }
  };
  
  reader.onerror = () => {
    onError('Failed to read file');
  };
  
  reader.readAsText(file);
};

const validateRealmData = (data) => {
  // Check required fields
  if (!data.name || !data.rows || !data.cols || !data.terrain) {
    return false;
  }
  
  // Check if terrain data is an array
  if (!Array.isArray(data.terrain)) {
    return false;
  }
  
  // Check if optional arrays are arrays if they exist
  if (data.holdings && !Array.isArray(data.holdings)) {
    return false;
  }
  
  if (data.landmarks && !Array.isArray(data.landmarks)) {
    return false;
  }
  
  if (data.myths && !Array.isArray(data.myths)) {
    return false;
  }
  
  return true;
};

const createRealmFromImportData = (data) => {
  // Create new realm with imported dimensions
  const realm = new Realm(data.rows, data.cols);
  realm.name = data.name;
  
  // Import terrain data
  data.terrain.forEach(terrainHex => {
    const terrainType = terrainTypes.find(t => t.type === terrainHex.type);
    if (terrainType) {
      realm.setHex(terrainHex.row, terrainHex.col, terrainType);
    }
  });
  
  // Import holdings
  if (data.holdings) {
    realm.holdings = data.holdings.map(holding => ({
      row: holding.row,
      col: holding.col,
      isSeatOfPower: holding.isSeatOfPower || false,
      name: holding.name || "Unknown"
    }));
  }
  
  // Import landmarks
  if (data.landmarks) {
    realm.landmarks = data.landmarks.map(landmark => ({
      row: landmark.row,
      col: landmark.col,
      type: landmark.type,
      name: landmark.name,
      seer: landmark.seer || null
    }));
  }
  
  // Import myths
  if (data.myths) {
    realm.myths = data.myths.map(myth => ({
      row: myth.row,
      col: myth.col,
      name: myth.name
    }));
  }
  
  return realm;
};