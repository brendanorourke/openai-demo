
import { getApiKey } from './apiKeyStorage';
import { imageToBase64 } from './imageUtils';
import { RecommendationItem } from '@/types/recommendation';

interface MatchVerificationResult {
  answer: 'yes' | 'no';
  reason: string;
  score?: number;
}

/**
 * Verify if a recommended item matches well with the reference image
 */
export const verifyMatch = async (
  referenceImageUrl: string,
  itemId: string
): Promise<MatchVerificationResult> => {
  try {
    console.log(`🔍 Verifying match between reference image and item ${itemId}`);
    
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error('❌ No OpenAI API key found');
      throw new Error('No OpenAI API key found. Please add your API key in the Settings.');
    }
    
    // Convert the reference image to base64
    const referenceImageBase64 = imageToBase64(referenceImageUrl);
    
    // Get the recommended item image URL
    const itemImageUrl = `/items/${itemId}.jpg`;
    
    // We need to fetch the item image since it's a local URL
    const itemImageResponse = await fetch(itemImageUrl);
    if (!itemImageResponse.ok) {
      console.error(`❌ Failed to fetch item image: ${itemImageUrl}`);
      return { answer: 'no', reason: 'Could not load item image for verification' };
    }
    
    const itemImageBlob = await itemImageResponse.blob();
    const itemImageBase64 = await blobToBase64(itemImageBlob);
    
    console.log('📡 Sending match verification request to OpenAI GPT-4o API', {
      model: 'gpt-4o',
      max_tokens: 300
    });
    
    // API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You will be given two images of two different items of clothing.
                      Your goal is to decide if the items in the images would work in an outfit together.
                      The first image is the reference item (the item that the user is trying to match with another item).
                      You need to decide if the second item would work well with the reference item.
                      Your response must be a JSON output with the following fields: "answer", "reason".
                      The "answer" field must be either "yes" or "no", depending on whether you think the items would work well together.
                      The "reason" field must be a short explanation of your reasoning for your decision. Do not include the descriptions of the 2 images.
                      Do not include the \`\`\`json \`\`\` tag in the output.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${referenceImageBase64}`,
                },
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${itemImageBase64}`,
                },
              }
            ],
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API verification error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const contentString = data.choices[0].message.content;
    
    console.log('✅ Received verification result from OpenAI GPT-4o API', {
      usage: data.usage,
      response_length: contentString.length
    });
    
    // Parse the JSON response
    const verificationResult = JSON.parse(contentString) as MatchVerificationResult;
    console.log('📊 Parsed verification result:', verificationResult);
    
    return verificationResult;
  } catch (error) {
    console.error('❌ Error verifying match:', error);
    return { answer: 'no', reason: 'Error during verification process' };
  }
};

/**
 * Verify multiple items in parallel
 */
export const verifyMultipleMatches = async (
  referenceImageUrl: string,
  items: RecommendationItem[]
): Promise<(RecommendationItem & { matchReason?: string })[]> => {
  console.log(`🔍 Verifying ${items.length} matches against reference image`);
  
  // Process items in batches to avoid too many concurrent API calls
  const batchSize = 3;
  const results: (RecommendationItem & { matchReason?: string })[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`📦 Processing batch ${i / batchSize + 1} with ${batch.length} items`);
    
    const verificationPromises = batch.map(async (item) => {
      try {
        const result = await verifyMatch(referenceImageUrl, item.id);
        
        if (result.answer === 'yes') {
          return {
            ...item,
            matchReason: result.reason
          };
        }
        
        console.log(`❌ Item ${item.id} was rejected: ${result.reason}`);
        return null;
      } catch (error) {
        console.error(`Error verifying item ${item.id}:`, error);
        return null;
      }
    });
    
    const batchResults = await Promise.all(verificationPromises);
    
    // Filter out null results and add valid items
    results.push(...batchResults.filter(Boolean) as (RecommendationItem & { matchReason?: string })[]);
  }
  
  console.log(`✅ Verification complete. ${results.length} out of ${items.length} items passed verification.`);
  return results;
};

/**
 * Convert a Blob to base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
