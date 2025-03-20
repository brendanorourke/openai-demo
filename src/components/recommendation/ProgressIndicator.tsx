
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AnalysisStep } from '@/hooks/useImageAnalysis';

interface ProgressIndicatorProps {
  currentStep: AnalysisStep;
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, progress }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className={currentStep === 'upload' ? 'text-primary' : 'text-gray-600'}>
          1. Upload Reference Image
        </span>
        <span className={currentStep === 'analyzing' ? 'text-primary' : (currentStep === 'results' ? 'text-gray-600' : 'text-gray-400')}>
          2. AI Analysis
        </span>
        <span className={currentStep === 'results' ? 'text-primary' : 'text-gray-400'}>
          3. Recommendations
        </span>
      </div>
      <Progress 
        value={currentStep === 'upload' ? 0 : (currentStep === 'analyzing' ? progress : 100)} 
        className="h-2" 
      />
    </div>
  );
};

export default ProgressIndicator;
