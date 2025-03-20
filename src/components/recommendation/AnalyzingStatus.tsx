
import React from 'react';

const AnalyzingStatus: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="animate-pulse">
        <h2 className="text-xl font-medium mb-4">AI is analyzing your image...</h2>
        <p className="text-gray-500 mb-6">This may take a few moments</p>
      </div>
    </div>
  );
};

export default AnalyzingStatus;
