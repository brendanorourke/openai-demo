
import { getApiKey } from './apiKeyStorage';

/**
 * Generate text embeddings using OpenAI's API
 */
export const generateEmbeddings = async (text: string): Promise<number[]> => {
  try {
    console.log(`📤 Generating embeddings for text: "${text}"`);
    
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error('❌ No OpenAI API key found');
      throw new Error('No OpenAI API key found. Please add your API key in the Settings.');
    }
    
    // Log the API request details (without sensitive data)
    console.log('📡 Sending embedding request to OpenAI API', {
      model: 'text-embedding-3-large',
      dimensions: 256
    });
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-large',
        input: text,
        dimensions: 256, // Using a smaller dimension for efficiency
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API embedding error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Received embeddings from OpenAI API', {
      embedding_dimensions: data.data[0].embedding.length,
      model: data.model,
      usage: data.usage
    });
    
    return data.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    throw error;
  }
};
