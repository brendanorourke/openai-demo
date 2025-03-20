
import { RecommendationItem } from '@/types/recommendation';
import { calculateCosineSimilarity } from './vectorOperations';

/**
 * Find similar items based on cosine similarity
 */
export const findSimilarItems = (
  inputEmbedding: number[],
  items: RecommendationItem[],
  threshold = 0.5,
  topK = 2
): RecommendationItem[] => {
  console.log(`🔍 Finding similar items with threshold ${threshold} and topK ${topK}`);
  console.log(`📊 Total items to search: ${items.length}`);
  
  // Filter out items without valid embeddings
  const itemsWithEmbeddings = items.filter(item => 
    item.embeddings && 
    Array.isArray(item.embeddings) && 
    item.embeddings.length > 0 &&
    item.embeddings.every(val => typeof val === 'number')
  );
  
  if (itemsWithEmbeddings.length === 0) {
    console.warn('⚠️ No items with valid embeddings found in the database');
    console.log('📊 Sample of first few items to debug:');
    items.slice(0, 3).forEach((item, i) => {
      console.log(`Item ${i}:`, {
        id: item.id,
        hasEmbeddings: !!item.embeddings,
        embeddingsType: item.embeddings ? (Array.isArray(item.embeddings) ? 'array' : typeof item.embeddings) : 'undefined',
        embeddingsLength: item.embeddings && Array.isArray(item.embeddings) ? item.embeddings.length : 0,
        firstValueType: item.embeddings && Array.isArray(item.embeddings) && item.embeddings.length > 0 ? typeof item.embeddings[0] : 'none'
      });
    });
    return [];
  }
  
  console.log(`📊 Found ${itemsWithEmbeddings.length} items with valid embeddings`);
  console.log(`📊 Input embedding dimensions: ${inputEmbedding.length}`);
  
  // Log sample of embeddings for debugging
  if (itemsWithEmbeddings.length > 0) {
    const sampleItem = itemsWithEmbeddings[0];
    console.log(`Sample item ID: ${sampleItem.id}`);
    console.log(`Sample item embedding dimensions: ${sampleItem.embeddings!.length}`);
    console.log(`Sample item first few embedding values:`, sampleItem.embeddings!.slice(0, 3));
  }
  
  // Calculate similarities
  const similarities = itemsWithEmbeddings.map(item => {
    try {
      const similarity = calculateCosineSimilarity(inputEmbedding, item.embeddings!);
      return { item, similarity };
    } catch (error) {
      console.error(`Error calculating similarity for item ${item.id}:`, error);
      return { item, similarity: 0 }; // Default to no similarity on error
    }
  });
  
  // Filter by threshold and sort by similarity
  const filteredSimilarities = similarities
    .filter(({ similarity }) => similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  console.log(`✅ Found ${filteredSimilarities.length} items above threshold ${threshold}`);
  
  if (filteredSimilarities.length > 0) {
    console.log('Top matches:', filteredSimilarities.map(s => ({ 
      id: s.item.id, 
      name: s.item.productDisplayName,
      similarity: s.similarity.toFixed(4)
    })));
  }
  
  return filteredSimilarities.map(({ item }) => item);
};
