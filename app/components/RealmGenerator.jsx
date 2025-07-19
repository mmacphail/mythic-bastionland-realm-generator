import { useState } from "react";
import { terrainTypes, hexConfig } from "../utils/hexUtils";
import { Realm } from "../utils/realmModel";
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
      console.log("Hex deselected:", selectedHex);
      setSelectedHex(null);
    } else {
      console.log("Hex selected:", hex);
      setSelectedHex(hex);
    }
  };

  const handleHexClick = (row, col) => {
    const currentHex = realm.getHex(row, col);
    const currentIndex = terrainTypes.findIndex(
      (t) => t.type === currentHex.terrainType.type
    );
    const nextIndex = (currentIndex + 1) % terrainTypes.length;

    const newRealm = realm.copy();
    newRealm.setHex(row, col, terrainTypes[nextIndex]);

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

  const editHexTerrain = (row, col, terrainType) => {
    const newRealm = realm.copy();
    newRealm.setHex(row, col, terrainType);
    setRealm(newRealm);
    
    if (selectedHex && selectedHex.row === row && selectedHex.col === col) {
      setSelectedHex(newRealm.getHex(row, col));
    }
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
