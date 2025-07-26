const RealmGenerationControls = ({ 
  onGenerateRandom, 
  onGenerateBalanced, 
  onGenerateClustered, 
  onGenerateWeighted, 
  onClear,
  onExport 
}) => {
  const handleExport = () => {
    onExport();
  };

  return (
    <div className="generation-controls mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={onGenerateRandom}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Random
        </button>
        <button
          onClick={onGenerateBalanced}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Generate Balanced
        </button>
        <button
          onClick={onGenerateClustered}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Generate Clustered
        </button>
        <button
          onClick={onGenerateWeighted}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Generate Weighted
        </button>
        <button
          onClick={onClear}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          title="Export realm as JSON file"
        >
          Export Realm
        </button>
      </div>
    </div>
  );
};

export default RealmGenerationControls;
