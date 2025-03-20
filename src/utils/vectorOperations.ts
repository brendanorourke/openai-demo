
/**
 * Vector operations and similarity calculations
 */

/**
 * Calculate cosine similarity between two vectors
 */
export const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  // Ensure vectors are of same length
  if (vecA.length !== vecB.length) {
    console.error(`Vectors must be of same length for cosine similarity calculation. VecA length: ${vecA.length}, VecB length: ${vecB.length}`);
    
    // If the vectors have different dimensions, we can either:
    // 1. Return 0 (no similarity)
    // 2. Truncate to the shorter length
    // 3. Pad the shorter vector with zeros
    
    // Let's use approach #2 - truncate to shorter length
    const minLength = Math.min(vecA.length, vecB.length);
    const truncatedVecA = vecA.slice(0, minLength);
    const truncatedVecB = vecB.slice(0, minLength);
    
    console.log(`Truncating vectors to common length: ${minLength}`);
    
    // Calculate with truncated vectors
    return calculateCosineSimilarityInternal(truncatedVecA, truncatedVecB);
  }
  
  return calculateCosineSimilarityInternal(vecA, vecB);
};

/**
 * Internal implementation of cosine similarity calculation
 * Assumes vectors are of the same length
 */
const calculateCosineSimilarityInternal = (vecA: number[], vecB: number[]): number => {
  // Calculate dot product
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  
  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  // Check for zero magnitude to avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
};
