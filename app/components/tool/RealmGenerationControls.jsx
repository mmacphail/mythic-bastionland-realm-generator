import { useRef } from 'react';

const RealmGenerationControls = ({ 
  onGenerateRandom, 
  onGenerateBalanced, 
  onGenerateClustered, 
  onGenerateWeighted, 
  onClear,
  onExport,
  onImport 
}) => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    onExport();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      onImport(file);
    } else if (file) {
      alert('Please select a valid JSON file');
    }
    // Reset file input
    event.target.value = '';
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
        <button
          onClick={handleImportClick}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          title="Import realm from JSON file"
        >
          Import Realm
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default RealmGenerationControls;
