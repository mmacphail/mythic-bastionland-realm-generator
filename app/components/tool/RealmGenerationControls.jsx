
const RealmGenerationControls = ({ 
  onGenerateRandom, 
  onGenerateBalanced, 
  onGenerateClustered, 
  onGenerateWeighted, 
  onClear 
}) => {
  return (
    <div className="generation-controls mb-4">
      <h3 className="text-lg font-semibold mb-2">Realm Generation</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={onGenerateRandom}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Random
        </button>
        <button 
          onClick={onGenerateBalanced}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Balanced
        </button>
        <button 
          onClick={onGenerateClustered}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Clustered
        </button>
        <button 
          onClick={onGenerateWeighted}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Weighted
        </button>
        <button 
          onClick={onClear}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default RealmGenerationControls;
