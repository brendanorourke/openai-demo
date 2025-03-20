
import { RecommendationItem, AnalysisResult } from '@/types/recommendation';

/**
 * Filter recommendations based on analysis results
 */
export const filterRecommendationsByAnalysis = (
  recommendations: RecommendationItem[],
  analysis: AnalysisResult
): RecommendationItem[] => {
  console.log(`🔍 Filtering recommendations by analysis criteria`, {
    total_items: recommendations.length,
    gender: analysis.gender,
    category: analysis.category
  });
  
  // First filter by gender
  const filtered = recommendations.filter(item => {
    // Match by gender (case insensitive)
    const genderMatch = item.gender.toLowerCase() === analysis.gender.toLowerCase();
    
    // If we can find an exact category match, prioritize that
    const categoryNameMatch = item.subCategory === analysis.category || 
                              item.masterCategory === analysis.category || 
                              item.articleType === analysis.category;
    
    return genderMatch && categoryNameMatch;
  });
  
  console.log(`✅ Found ${filtered.length} items matching gender "${analysis.gender}" and category "${analysis.category}"`);
  return filtered;
};
