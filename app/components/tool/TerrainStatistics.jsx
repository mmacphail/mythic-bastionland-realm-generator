
const TerrainStatistics = ({ terrainStats, terrainTypes }) => {
  return (
    <div>
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">Statistics:</h4>
      <div className="text-sm text-gray-700 dark:text-gray-300">
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
