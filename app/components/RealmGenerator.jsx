import { useState } from "react";
import { terrainTypes, hexConfig } from "../utils/hexUtils";
import { Realm } from "../utils/realmModel";
import { RealmGenerator as RealmGeneratorUtil } from "../utils/realmGenerator";
import RealmGenerationControls from "./RealmGenerationControls";
import TerrainLegend from "./TerrainLegend";
import TerrainStatistics from "./TerrainStatistics";
import HexMap from "./HexMap";
import HexEditor from "./HexEditor";
import RealmOverview from "./RealmOverview";

const RealmGenerator = ({ rows = 12, cols = 12 }) => {
  const [realm, setRealm] = useState(() => new Realm(rows, cols));

  const hexSize = hexConfig.defaultSize;
  const { width: svgWidth, height: svgHeight } = hexConfig.getSvgDimensions(
    rows,
    cols,
    hexSize
  );

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

  return (
    <div className="flex gap-4 min-h-screen">
      {/* Left Panel - Hex Editor */}
      <div className="w-64 flex-shrink-0">
        <HexEditor />
      </div>

      {/* Main Content */}
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

        <HexMap
          realm={realm}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          hexSize={hexSize}
          onHexClick={handleHexClick}
        />

        {/* Realm Overview - Below the hex map */}
        <div className="mt-4">
          <RealmOverview realm={realm} />
        </div>
      </div>
    </div>
  );
};

export default RealmGenerator;
