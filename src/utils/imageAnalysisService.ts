
import { AnalysisResult } from '@/types/recommendation';
import { getApiKey } from './apiKeyStorage';
import { imageToBase64 } from './imageUtils';

/**
 * Analyze an image using OpenAI's GPT-4o model
 */
export const analyzeImage = async (imageDataUrl: string): Promise<AnalysisResult> => {
  try {
    console.log('🖼️ Starting image analysis process');
    
    const base64Image = imageToBase64(imageDataUrl);
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error('❌ No OpenAI API key found');
      throw new Error('No OpenAI API key found. Please add your API key in the Settings.');
    }
    
    // List of possible subcategories from our dataset
    const subcategories = [
      "Topwear", "Bottomwear", "Watches", "Socks", "Shoes", "Belts", 
      "Flip Flops", "Bags", "Innerwear", "Sandal", "Shoe Accessories", 
      "Fragrance", "Jewellery", "Wallets", "Apparel Set", "Headwear", 
      "Mufflers", "Skin Care", "Makeup", "Hair", "Free Gifts", "Accessories"
    ];

    console.log('📡 Sending image analysis request to OpenAI GPT-4o API', {
      model: 'gpt-4o',
      max_tokens: 1000,
      subcategories_provided: subcategories.length
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
                text: `Given an image of an item of clothing, analyze the item and generate a JSON output with the following fields: "items", "category", and "gender". 
                       Use your understanding of fashion trends, styles, and gender preferences to provide accurate and relevant suggestions for how to complete the outfit.
                       The items field should be a list of items that would go well with the item in the picture. Each item should represent a title of an item of clothing that contains the style, color, and gender of the item.
                       The category needs to be chosen between the types in this list: ${JSON.stringify(subcategories)}.
                       You have to choose between the genders in this list: [Men, Women, Boys, Girls, Unisex]
                       Do not include the description of the item in the picture. Do not include the \`\`\`json \`\`\` tag in the output.
                       
                       Example Input: An image representing a black leather jacket.

                       Example Output: {"items": ["Fitted White Women's T-shirt", "White Canvas Sneakers", "Women's Black Skinny Jeans"], "category": "Jackets", "gender": "Women"}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              }
            ],
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API analysis error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const contentString = data.choices[0].message.content;
    
    console.log('✅ Received analysis from OpenAI GPT-4o API', {
      usage: data.usage,
      response_length: contentString.length
    });
    
    // Parse the JSON response
    const analysisResult = JSON.parse(contentString) as AnalysisResult;
    console.log('📊 Parsed analysis result:', analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error('❌ Error analyzing image:', error);
    throw error;
  }
};
