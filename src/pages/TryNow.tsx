
import React from 'react';
import Layout from '@/components/Layout';
import UploadStep from '@/components/recommendation/UploadStep';
import RecommendationResults from '@/components/recommendation/RecommendationResults';
import ProgressIndicator from '@/components/recommendation/ProgressIndicator';
import AnalyzingStatus from '@/components/recommendation/AnalyzingStatus';
import { useCSVDatabase } from '@/hooks/useCSVDatabase';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { toast } from '@/components/ui/use-toast';

const TryNow = () => {
  // Load the CSV database
  const { allItems } = useCSVDatabase();
  
  // Set up the image analysis process
  const {
    currentStep,
    uploadedImage,
    recommendations,
    isLoading,
    progress,
    analysisResult,
    handleImageUpload,
    handleReset
  } = useImageAnalysis(allItems);

  // Handle API key missing
  React.useEffect(() => {
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey) {
      toast({
        title: "OpenAI API Key Required",
        description: "Please add your OpenAI API key in the Settings to use this feature.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Shopping Assistant</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload a fashion item and our AI will suggest matching items from our collection.
            </p>
          </div>

          {/* Progress indicator */}
          <ProgressIndicator currentStep={currentStep} progress={progress} />

          {/* Step content */}
          {currentStep === 'upload' && (
            <UploadStep onImageUpload={handleImageUpload} isLoading={isLoading} />
          )}

          {(currentStep === 'analyzing' && isLoading) && (
            <AnalyzingStatus />
          )}

          {currentStep === 'results' && uploadedImage && (
            <RecommendationResults 
              uploadedImage={uploadedImage} 
              recommendations={recommendations}
              onReset={handleReset}
              analysisResult={analysisResult}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TryNow;
