
import { RecommendationItem, AnalysisResult } from '@/types/recommendation';
import { generateEmbeddings } from './embeddingService';
import { findSimilarItems } from './similarityService';
import { verifyMultipleMatches } from './matchVerificationService';

/**
 * Find recommendations based on the analysis results and using embeddings
 */
export const findRecommendationsWithEmbeddings = async (
  allItems: RecommendationItem[],
  analysis: AnalysisResult,
  threshold = 0.5,
  // Ensure we consistently use topK = 2 for all similarity searches
  topK = 2
): Promise<RecommendationItem[]> => {
  try {
    console.log('🔍 Finding recommendations using embeddings', {
      total_items: allItems.length,
      gender: analysis.gender,
      items_to_match: analysis.items.length,
      threshold,
      topK // Logging the enforced topK value
    });
    
    // First filter by gender to reduce the search space
    const genderFilteredItems = allItems.filter(item => 
      item.gender.toLowerCase() === analysis.gender.toLowerCase()
    );
    
    console.log(`📊 Filtered down to ${genderFilteredItems.length} items matching gender "${analysis.gender}"`);
    
    // Exit early if no gender matches found
    if (genderFilteredItems.length === 0) {
      console.warn(`⚠️ No items matching gender "${analysis.gender}" found in database`);
      return [];
    }
    
    // Generate embeddings for each item in the "items" array
    const recommendationPromises = analysis.items.map(async (itemText) => {
      try {
        console.log(`🔄 Processing recommendation for: "${itemText}"`);
        
        // Generate embeddings for the item text
        const embedding = await generateEmbeddings(itemText);
        
        // Find similar items using cosine similarity with explicit topK = 2
        const similarItems = findSimilarItems(embedding, genderFilteredItems, threshold, topK);
        console.log(`✅ Found ${similarItems.length} similar items for "${itemText}" with topK=${topK}`);
        
        return similarItems;
      } catch (error) {
        console.error(`❌ Error processing item "${itemText}":`, error);
        return [];
      }
    });
    
    // Wait for all embeddings and similarity searches to complete
    const recommendationsArrays = await Promise.all(recommendationPromises);
    
    // Flatten the array of arrays into a single array of recommendations
    const allRecommendations = recommendationsArrays.flat();
    console.log(`📊 Total recommendations before verification: ${allRecommendations.length}`);
    
    // Remove duplicates based on item ID
    const uniqueRecommendations: RecommendationItem[] = [];
    const seenIds = new Set<string>();
    
    allRecommendations.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueRecommendations.push(item);
      }
    });
    
    console.log(`📊 Recommendations after deduplication: ${uniqueRecommendations.length}`);
    
    // Apply the guardrail verification if there's a reference image
    if (uniqueRecommendations.length > 0) {
      console.log(`🛡️ Applying guardrail verification to refine recommendations`);
      return await verifyMultipleMatches(analysis.referenceImageUrl, uniqueRecommendations);
    }
    
    return uniqueRecommendations;
  } catch (error) {
    console.error('❌ Error finding recommendations with embeddings:', error);
    throw error;
  }
};
