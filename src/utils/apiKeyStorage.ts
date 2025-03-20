
/**
 * Utility functions for managing API keys
 */

// localStorage key for the OpenAI API key
export const LOCAL_STORAGE_API_KEY = 'openai-api-key';

/**
 * Get the OpenAI API key from localStorage or environment variable
 */
export const getApiKey = (): string => {
  // First try to get the API key from localStorage
  const localStorageKey = localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // Fall back to the environment variable
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};
