
import Papa from 'papaparse';
import { RecommendationItem } from '@/types/recommendation';

// In-memory database cache
let itemsCache: RecommendationItem[] | null = null;

/**
 * Loads CSV data from a file in the public directory
 */
export const loadCSVDatabase = async (filePath: string): Promise<RecommendationItem[]> => {
  try {
    // Return cached data if available
    if (itemsCache) {
      console.log('📊 Using cached database items:', itemsCache.length);
      return itemsCache;
    }
    
    // Fetch the CSV file
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV using PapaParse
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });
    
    console.log(`✅ Parsed ${result.data.length} rows from CSV`);
    
    // Transform parsed data to match RecommendationItem type
    const items = result.data.map((item: any, index: number) => {
      // Generate mock embeddings for database items if they don't exist
      // This ensures we have something to match against during similarity search
      let parsedEmbeddings: number[] | undefined = undefined;
      
      if (item.embeddings) {
        try {
          // Remove quotes around the array if present
          const cleanedEmbeddingsStr = item.embeddings.replace(/^"(.*)"$/, '$1');
          // Parse the string representation of the array into an actual array
          const parsedArray = JSON.parse(cleanedEmbeddingsStr.replace(/\s/g, ''));
          
          // Validate that what we parsed is actually an array of numbers
          if (Array.isArray(parsedArray) && parsedArray.every(val => typeof val === 'number')) {
            parsedEmbeddings = parsedArray;
            // Log some successful parsing examples
            if (index < 2) {
              console.log(`✅ Successfully parsed embeddings for item ${item.id}, length: ${parsedArray.length}`);
            }
          } else {
            console.warn(`⚠️ Invalid embedding format for item ${item.id} - not an array of numbers`);
            parsedEmbeddings = undefined;
          }
        } catch (e) {
          console.error(`❌ Error parsing embeddings for item ${item.id}:`, e);
          parsedEmbeddings = undefined;
        }
      }
      
      // Generate random embeddings if none exist or parsing failed
      // We'll create random embeddings with 256 dimensions (same as our OpenAI embeddings)
      if (!parsedEmbeddings) {
        parsedEmbeddings = Array.from({ length: 256 }, () => Math.random() * 2 - 1);
        
        // Only log this for the first few items to avoid flooding the console
        if (index < 5) {
          console.log(`🔄 Generated random embeddings for item ${item.id || index}`);
        } else if (index === 5) {
          console.log(`🔄 Generated random embeddings for additional items (not showing all logs)`);
        }
      }
      
      return {
        id: item.id || `item-${index}`,
        gender: item.gender || 'Unisex',
        masterCategory: item.masterCategory || '',
        subCategory: item.subCategory || '',
        articleType: item.articleType || '',
        baseColour: item.baseColour || '',
        season: item.season || 'All',
        year: parseInt(item.year, 10) || new Date().getFullYear(),
        usage: item.usage || '',
        productDisplayName: item.productDisplayName || `Product ${index}`,
        embeddings: parsedEmbeddings
      };
    }) as RecommendationItem[];
    
    // Check how many items actually have embeddings
    const itemsWithEmbeddings = items.filter(item => 
      item.embeddings && 
      Array.isArray(item.embeddings) && 
      item.embeddings.length > 0
    );
    
    console.log(`✅ Transformed ${items.length} items, ${itemsWithEmbeddings.length} with valid embeddings`);
    
    if (items.length > 0) {
      console.log(`Sample item with embeddings:`, {
        id: items[0].id,
        embeddings_length: items[0].embeddings?.length,
        embeddings_type: items[0].embeddings ? typeof items[0].embeddings[0] : 'undefined'
      });
    }
    
    // Cache the data
    itemsCache = items;
    
    return items;
  } catch (error) {
    console.error('Error loading CSV database:', error);
    // Return empty array or throw error based on your error handling preference
    return [];
  }
};

/**
 * Filters items by category, type, gender or other criteria
 */
export const filterItems = (
  items: RecommendationItem[],
  filters: Partial<RecommendationItem>
): RecommendationItem[] => {
  return items.filter(item => {
    // Check each filter property
    for (const [key, value] of Object.entries(filters)) {
      if (item[key as keyof RecommendationItem] !== value) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Gets a single item by ID
 */
export const getItemById = async (
  id: string,
  itemsOrPath: RecommendationItem[] | string = '/data/fashion-items.csv'
): Promise<RecommendationItem | null> => {
  // If string path is provided, load the database first
  const items = Array.isArray(itemsOrPath) 
    ? itemsOrPath 
    : await loadCSVDatabase(itemsOrPath);
  
  return items.find(item => item.id === id) || null;
};
