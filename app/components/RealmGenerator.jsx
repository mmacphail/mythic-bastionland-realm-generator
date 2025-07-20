import { useState } from "react";
import { terrainTypes, hexConfig } from "../utils/hexUtils";
import { Realm, landmarkTypes } from "../utils/realmModel";
import { RealmGenerator as RealmGeneratorUtil, pickRandomLandmark, pickRandomLandmarkType, pickRandomMyth } from "../utils/realmGenerator";
import RealmGenerationControls from "./tool/RealmGenerationControls";
import TerrainLegend from "./tool/TerrainLegend";
import TerrainStatistics from "./tool/TerrainStatistics";
import HexMap from "./tool/HexMap";
import HexPainter from "./tool/HexPainter";
import HexDetails from "./tool/HexDetails";
import RealmOverview from "./tool/RealmOverview";

const RealmGenerator = ({ rows = 12, cols = 12 }) => {
  const [realm, setRealm] = useState(() => new Realm(rows, cols));
  const [selectedHex, setSelectedHex] = useState(null);
  const [paintingMode, setPaintingMode] = useState(false);
  const [selectedTerrainType, setSelectedTerrainType] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);

  const hexSize = hexConfig.defaultSize;
  const { width: svgWidth, height: svgHeight } = hexConfig.getSvgDimensions(
    rows,
    cols,
    hexSize
  );

  const selectHex = (hex) => {
    // If in painting mode, don't select hex - paint instead
    if (paintingMode) {
      paintHex(hex);
      return;
    }
    
    if(selectedHex && hex === selectedHex) {
      setSelectedHex(null);
    } else {
      setSelectedHex(hex);
    }
  };

  const handleHexMouseDown = (hex) => {
    if (paintingMode) {
      setIsDragging(true);
      setDragStarted(true);
      paintHex(hex);
    } else {
      selectHex(hex);
    }
  };

  const handleHexMouseEnter = (hex) => {
    if (paintingMode && isDragging && dragStarted) {
      paintHex(hex);
    }
  };

  const handleHexMouseUp = () => {
    if (paintingMode) {
      setIsDragging(false);
      setDragStarted(false);
    }
  };

  const startPainting = (terrainType) => {
    setPaintingMode(true);
    setSelectedTerrainType(terrainType);
    setSelectedHex(null); // Deselect any currently selected hex
  };

  const stopPainting = () => {
    setPaintingMode(false);
    setSelectedTerrainType(null);
    setIsDragging(false);
    setDragStarted(false);
  };

  const paintHex = (hex) => {
    if (!paintingMode || !selectedTerrainType) return;
    
    // Don't repaint if it's already the correct terrain type
    if (hex.terrainType.type === selectedTerrainType.type) return;
    
    const newRealm = realm.copy();
    newRealm.setHex(hex.row, hex.col, selectedTerrainType);
    setRealm(newRealm);
  };

  const generateRandomTerrain = () => {
    const newRealm = RealmGeneratorUtil.generateRealm("random");
    setRealm(newRealm);
  };

  const generateBalancedTerrain = () => {
    const newRealm = RealmGeneratorUtil.generateRealm("balanced");
    setRealm(newRealm);
  };

  const generateClusteredTerrain = () => {
    const newRealm = RealmGeneratorUtil.generateRealm("clustered");
    setRealm(newRealm);
  };

  const generateWeightedTerrain = () => {
    const newRealm = RealmGeneratorUtil.generateRealm("weighted");
    setRealm(newRealm);
  };

  const clearTerrain = () => {
    const newRealm = new Realm(rows, cols);
    setRealm(newRealm);
  };

  const getTerrainStats = () => {
    return realm.getTerrainStats();
  };

  const updateSelectedHex = (row, col, newRealm) => {
    const hex = newRealm.getHex(row, col);
    setSelectedHex(hex);
  };

  const editHexTerrain = (row, col, terrainType) => {
    const newRealm = realm.copy();
    newRealm.setHex(row, col, terrainType);
    setRealm(newRealm);
    
    updateSelectedHex(row, col, newRealm);
  };

  const addHolding = (row, col, isSeatOfPower = false, name = "Unknown") => {
    const newRealm = realm.copy();
    newRealm.addHolding(row, col, isSeatOfPower, name);
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const updateHolding = (row, col, isSeatOfPower, name = "Unknown") => {
    const newRealm = realm.copy();
    const holdingIndex = newRealm.holdings.findIndex(h => h.row === row && h.col === col);
    if (holdingIndex !== -1) {
      newRealm.holdings[holdingIndex].isSeatOfPower = isSeatOfPower;
      newRealm.holdings[holdingIndex].name = name;
    }
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const removeHolding = (row, col) => {
    const newRealm = realm.copy();
    newRealm.holdings = newRealm.holdings.filter(h => !(h.row === row && h.col === col));
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const addLandmark = (row, col) => {
    const newRealm = realm.copy();

    const landmarkType = pickRandomLandmarkType();
    const landmark = pickRandomLandmark(landmarkType);

    newRealm.addLandmark(row, col, landmarkType, landmark);
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const updateLandmark = (row, col, type, name, seer = null) => {
    const newRealm = realm.copy();
    const landmarkIndex = newRealm.landmarks.findIndex(l => l.row === row && l.col === col);
    if (landmarkIndex !== -1) {
      newRealm.landmarks[landmarkIndex].type = type;
      newRealm.landmarks[landmarkIndex].name = name;
      newRealm.landmarks[landmarkIndex].seer = seer;
    }
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const removeLandmark = (row, col) => {
    const newRealm = realm.copy();
    newRealm.landmarks = newRealm.landmarks.filter(l => !(l.row === row && l.col === col));
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const addMyth = (row, col) => {
    const newRealm = realm.copy();
    const myth = pickRandomMyth();
    newRealm.addMyth(row, col, myth);
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const updateMyth = (row, col, name) => {
    const newRealm = realm.copy();
    const mythIndex = newRealm.myths.findIndex(m => m.row === row && m.col === col);
    if (mythIndex !== -1) {
      newRealm.myths[mythIndex].name = name;
    }
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const removeMyth = (row, col) => {
    const newRealm = realm.copy();
    newRealm.myths = newRealm.myths.filter(m => !(m.row === row && m.col === col));
    setRealm(newRealm);
    updateSelectedHex(row, col, newRealm);
  };

  const editRealmName = (newName) => {
    const newRealm = realm.copy();
    newRealm.name = newName;
    setRealm(newRealm);
  };

  return (
    <div className="min-h-screen" onMouseUp={handleHexMouseUp}>
      <div className="flex-1 hex-grid-container">
        <div className="controls mb-4">
          <h2 className="text-2xl font-bold mb-2">
            Mythic Bastionland Realm Maker
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <label className="font-semibold">Realm Name:</label>
            <input
              type="text"
              value={realm.name}
              onChange={(e) => editRealmName(e.target.value)}
              className="border p-1"
            />
          </div>

          <RealmGenerationControls
            onGenerateRandom={generateRandomTerrain}
            onGenerateBalanced={generateBalancedTerrain}
            onGenerateClustered={generateClusteredTerrain}
            onGenerateWeighted={generateWeightedTerrain}
            onClear={clearTerrain}
          />

          <div className="legend flex flex-wrap gap-2 mb-4">
            <TerrainLegend terrainTypes={terrainTypes} />
            <TerrainStatistics
              terrainStats={getTerrainStats()}
              terrainTypes={terrainTypes}
            />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-64 flex-shrink-0">
            <HexPainter 
              terrainTypes={terrainTypes}
              paintingMode={paintingMode}
              selectedTerrainType={selectedTerrainType}
              onStartPainting={startPainting}
              onStopPainting={stopPainting}
            />
          </div>

          <div className="flex-1">
            <HexMap
              realm={realm}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              hexSize={hexSize}
              selectHex={selectHex}
              selectedHex={selectedHex}
              paintingMode={paintingMode}
              onHexMouseDown={handleHexMouseDown}
              onHexMouseEnter={handleHexMouseEnter}
              onHexMouseUp={handleHexMouseUp}
            />
          </div>

          <div className="w-64 flex-shrink-0">
            <HexDetails 
              realm={realm} 
              selectedHex={selectedHex} 
              onTerrainChange={editHexTerrain}
              onAddHolding={addHolding}
              onUpdateHolding={updateHolding}
              onRemoveHolding={removeHolding}
              onAddLandmark={addLandmark}
              onUpdateLandmark={updateLandmark}
              onRemoveLandmark={removeLandmark}
              onAddMyth={addMyth}
              onUpdateMyth={updateMyth}
              onRemoveMyth={removeMyth}
            />
          </div>
        </div>

        <div className="mt-4">
          <RealmOverview realm={realm} />
        </div>
      </div>
    </div>
  );
};

export default RealmGenerator;
