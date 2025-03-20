
import { useState, useEffect } from 'react';
import { RecommendationItem } from '@/types/recommendation';
import { loadCSVDatabase } from '@/utils/csvDatabase';
import { useToast } from '@/components/ui/use-toast';
import { mockRecommendations } from '@/utils/mockData';

export const useCSVDatabase = () => {
  const [allItems, setAllItems] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 useCSVDatabase hook activated, loading CSV database');
    
    const fetchData = async () => {
      try {
        console.log('📚 Fetching fashion items database from CSV');
        const items = await loadCSVDatabase('/data/fashion-items.csv');
        setAllItems(items);
        console.log(`✅ Loaded ${items.length} items from CSV database`);
      } catch (error) {
        console.error('❌ Failed to load CSV database:', error);
        toast({
          title: 'Database Error',
          description: 'Could not load product database. Using fallback data.',
          variant: 'destructive',
        });
        // Use mock data as fallback
        console.log('⚠️ Using mock data as fallback for database');
        setAllItems(mockRecommendations);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return { allItems, isLoading };
};
