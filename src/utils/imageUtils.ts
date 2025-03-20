
/**
 * Utility functions for image processing
 */

/**
 * Convert an image to base64
 */
export const imageToBase64 = (dataUrl: string): string => {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = dataUrl.split(',')[1];
  return base64Data;
};
