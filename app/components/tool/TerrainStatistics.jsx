
const TerrainStatistics = ({ terrainStats, terrainTypes }) => {
  return (
    <div>
      <h4 className="font-semibold mb-1">Statistics:</h4>
      <div className="text-sm">
        {Object.entries(terrainStats).map(([type, count]) => (
          <span key={type} className="mr-2">
            {terrainTypes.find(t => t.type === type)?.name}: {count}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TerrainStatistics;
