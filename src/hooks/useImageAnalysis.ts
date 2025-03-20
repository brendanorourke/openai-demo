import { useState } from 'react';
import { UploadedImage, RecommendationItem, AnalysisResult } from '@/types/recommendation';
import { useToast } from '@/components/ui/use-toast';
import { 
  analyzeImage, 
  filterRecommendationsByAnalysis, 
  findRecommendationsWithEmbeddings 
} from '@/utils/imageAnalysis';
import { mockRecommendations } from '@/utils/mockData';

export type AnalysisStep = 'upload' | 'analyzing' | 'results';

export const useImageAnalysis = (allItems: RecommendationItem[]) => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (image: UploadedImage) => {
    console.log('🖼️ Image upload initiated', {
      fileType: image.file.type,
      fileSize: `${(image.file.size / 1024).toFixed(2)} KB`
    });
    
    setUploadedImage(image);
    setIsLoading(true);
    setCurrentStep('analyzing');
    
    try {
      console.log('⏳ Starting analysis process');
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 2;
        setProgress(Math.min(currentProgress, 90)); // Cap at 90% until analysis completes
        if (currentProgress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);

      console.log('🧠 Calling OpenAI API to analyze image');
      const analysis = await analyzeImage(image.dataUrl);
      console.log('✅ Image analysis completed', analysis);
      
      const analysisWithReference = {
        ...analysis,
        referenceImageUrl: image.dataUrl
      };
      
      setAnalysisResult(analysisWithReference);
      
      console.log('🔍 Starting embedding-based recommendation process');
      let embeddingRecommendations: RecommendationItem[] = [];
      try {
        embeddingRecommendations = await findRecommendationsWithEmbeddings(
          allItems.length > 0 ? allItems : mockRecommendations,
          analysisWithReference
        );
        console.log("✅ Embedding recommendations:", embeddingRecommendations);
      } catch (embeddingError) {
        console.error('❌ Error using embedding-based recommendations:', embeddingError);
        toast({
          title: 'Recommendation Engine',
          description: 'Using fallback recommendation algorithm due to embedding API error.',
          variant: 'default',
        });
      }
      
      if (embeddingRecommendations.length === 0) {
        console.log('⚠️ No embedding recommendations found, falling back to category filtering');
        const filteredRecommendations = filterRecommendationsByAnalysis(
          allItems.length > 0 ? allItems : mockRecommendations,
          analysisWithReference
        );
        
        console.log(`📊 Category filtering returned ${filteredRecommendations.length} results`);
        
        let finalRecommendations = filteredRecommendations;
        if (filteredRecommendations.length < 1) {
          console.log('⚠️ No recommendations found, supplementing with gender-matched items');
          
          const genderMatches = (allItems.length > 0 ? allItems : mockRecommendations)
            .filter(item => item.gender.toLowerCase() === analysisWithReference.gender.toLowerCase());
          
          console.log(`📊 Found ${genderMatches.length} gender-matched items for supplementation`);
          
          const existingIds = new Set(filteredRecommendations.map(item => item.id));
          const additionalItems = genderMatches
            .filter(item => !existingIds.has(item.id))
            .slice(0, 6 - filteredRecommendations.length);
          
          finalRecommendations = [...filteredRecommendations, ...additionalItems];
          console.log(`📊 Final recommendation count after supplementation: ${finalRecommendations.length}`);
        }
        
        setRecommendations(finalRecommendations);
      } else {
        console.log(`✅ Using ${embeddingRecommendations.length} embedding-based recommendations`);
        setRecommendations(embeddingRecommendations);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      console.log('✅ Analysis and recommendation process completed');
      
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('results');
        console.log('🎉 Displaying results to user');
      }, 500);
      
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      toast({
        title: 'Analysis Error',
        description: 'Could not analyze the image. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      setCurrentStep('upload');
      setProgress(0);
    }
  };

  const handleReset = () => {
    console.log('🔄 User requested reset, returning to upload step');
    setCurrentStep('upload');
    setUploadedImage(null);
    setRecommendations([]);
    setProgress(0);
    setAnalysisResult(null);
  };

  return {
    currentStep,
    uploadedImage,
    recommendations,
    isLoading,
    progress,
    analysisResult,
    handleImageUpload,
    handleReset
  };
};
