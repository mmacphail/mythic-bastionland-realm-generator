
const TerrainLegend = ({ terrainTypes }) => {
  return (
    <div className="mr-4">
      <h4 className="font-semibold mb-1">Terrain Types:</h4>
      <div className="flex flex-wrap gap-2">
        {terrainTypes.map((terrain, index) => (
          <div key={terrain.type} className="flex items-center gap-1">
            <div className="w-4 h-4 border" style={{ backgroundColor: terrain.color }}></div>
            <span className="text-sm">{terrain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerrainLegend;
