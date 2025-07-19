import { useState } from "react";
import { terrainTypes, hexConfig } from "../utils/hexUtils";
import { Realm, landmarkTypes } from "../utils/realmModel";
import { RealmGenerator as RealmGeneratorUtil } from "../utils/realmGenerator";
import RealmGenerationControls from "./tool/RealmGenerationControls";
import TerrainLegend from "./tool/TerrainLegend";
import TerrainStatistics from "./tool/TerrainStatistics";
import HexMap from "./tool/HexMap";
import HexEditor from "./tool/HexEditor";
import HexDetails from "./tool/HexDetails";
import RealmOverview from "./tool/RealmOverview";

const RealmGenerator = ({ rows = 12, cols = 12 }) => {
  const [realm, setRealm] = useState(() => new Realm(rows, cols));
  const [selectedHex, setSelectedHex] = useState(null);

  const hexSize = hexConfig.defaultSize;
  const { width: svgWidth, height: svgHeight } = hexConfig.getSvgDimensions(
    rows,
    cols,
    hexSize
  );

  const selectHex = (hex) => {
    if(selectedHex && hex === selectedHex) {
      setSelectedHex(null);
    } else {
      setSelectedHex(hex);
    }
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

  const editHexTerrain = (row, col, terrainType) => {
    const newRealm = realm.copy();
    newRealm.setHex(row, col, terrainType);
    setRealm(newRealm);
    
    if (selectedHex && selectedHex.row === row && selectedHex.col === col) {
      setSelectedHex(newRealm.getHex(row, col));
    }
  };

  const addHolding = (row, col, isSeatOfPower = false) => {
    const newRealm = realm.copy();
    newRealm.addHolding(row, col, isSeatOfPower);
    setRealm(newRealm);
  };

  const updateHolding = (row, col, isSeatOfPower) => {
    const newRealm = realm.copy();
    const holdingIndex = newRealm.holdings.findIndex(h => h.row === row && h.col === col);
    if (holdingIndex !== -1) {
      newRealm.holdings[holdingIndex].isSeatOfPower = isSeatOfPower;
    }
    setRealm(newRealm);
  };

  const removeHolding = (row, col) => {
    const newRealm = realm.copy();
    newRealm.holdings = newRealm.holdings.filter(h => !(h.row === row && h.col === col));
    setRealm(newRealm);
  };

  const addLandmark = (row, col, type = landmarkTypes[0], name = '') => {
    const newRealm = realm.copy();
    newRealm.addLandmark(row, col, type, name);
    setRealm(newRealm);
  };

  const updateLandmark = (row, col, type, name) => {
    const newRealm = realm.copy();
    const landmarkIndex = newRealm.landmarks.findIndex(l => l.row === row && l.col === col);
    if (landmarkIndex !== -1) {
      newRealm.landmarks[landmarkIndex].type = type;
      newRealm.landmarks[landmarkIndex].name = name;
    }
    setRealm(newRealm);
  };

  const removeLandmark = (row, col) => {
    const newRealm = realm.copy();
    newRealm.landmarks = newRealm.landmarks.filter(l => !(l.row === row && l.col === col));
    setRealm(newRealm);
  };

  const addMyth = (row, col, name = '') => {
    const newRealm = realm.copy();
    newRealm.addMyth(row, col, name);
    setRealm(newRealm);
  };

  const updateMyth = (row, col, name) => {
    const newRealm = realm.copy();
    const mythIndex = newRealm.myths.findIndex(m => m.row === row && m.col === col);
    if (mythIndex !== -1) {
      newRealm.myths[mythIndex].name = name;
    }
    setRealm(newRealm);
  };

  const removeMyth = (row, col) => {
    const newRealm = realm.copy();
    newRealm.myths = newRealm.myths.filter(m => !(m.row === row && m.col === col));
    setRealm(newRealm);
  };

  return (
    <div className="min-h-screen">
      <div className="flex-1 hex-grid-container">
        <div className="controls mb-4">
          <h2 className="text-2xl font-bold mb-2">
            Mythic Bastionland Realm Maker
          </h2>
          <p className="text-gray-600 mb-4">
            Click on hexes to cycle through terrain types
          </p>

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
            <HexEditor />
          </div>

          <div className="flex-1">
            <HexMap
              realm={realm}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              hexSize={hexSize}
              selectHex={selectHex}
              selectedHex={selectedHex}
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
