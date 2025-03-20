import React, { useState } from 'react';
import { UploadedImage, RecommendationItem, AnalysisResult } from '@/types/recommendation';
import Button from '@/components/Button';
import { ArrowLeft, ShoppingBag, Sparkles, InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecommendationResultsProps {
  uploadedImage: UploadedImage;
  recommendations: RecommendationItem[];
  onReset: () => void;
  analysisResult: AnalysisResult | null;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  uploadedImage,
  recommendations,
  onReset,
  analysisResult
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Reference image */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">Your Reference Item</h3>
              <div className="aspect-square rounded-md overflow-hidden bg-black/5">
                <img
                  src={uploadedImage.dataUrl}
                  alt="Uploaded reference"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {analysisResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">AI Analysis</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-secondary/40">
                      {analysisResult.gender}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/40">
                      {analysisResult.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-2">
                    <p className="font-medium mb-1">Suggested items:</p>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                      {analysisResult.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="md:w-2/3">
          <h3 className="text-xl font-medium mb-4">AI Recommendations</h3>
          <p className="text-gray-600 mb-6">
            Based on your reference image, our AI has found these matching items:
          </p>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="tops">Tops</TabsTrigger>
              <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10">
                    <p className="text-gray-500">No matching items found. Try a different image.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tops" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations
                  .filter(item => item.masterCategory === 'Apparel' && ['Shirts', 'Tshirts', 'Kurtas'].includes(item.articleType))
                  .map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bottoms" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations
                  .filter(item => item.masterCategory === 'Apparel' && ['Jeans', 'Patiala', 'Pants'].includes(item.articleType))
                  .map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="accessories" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations
                  .filter(item => item.masterCategory === 'Accessories')
                  .map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button 
          variant="secondary" 
          onClick={onReset}
          icon={<ArrowLeft className="h-5 w-5" />}
          iconPosition="left"
        >
          Try a Different Image
        </Button>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  item: RecommendationItem & { matchReason?: string };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  // Calculate the default price (since price was removed from the data)
  const price = 79.99;
  
  // Default match score
  const matchScore = 0.85;
  
  const [imageError, setImageError] = useState(false);
  
  // Get the image source from the local items folder using the item ID
  const getItemImageSrc = () => {
    if (imageError) {
      return '/items/placeholder.jpg';
    }
    
    // Check if id is a number or a string that can be parsed as a number
    if (item.id && !isNaN(Number(item.id))) {
      return `/items/${item.id}.jpg`;
    }
    
    // Fallback to placeholder
    return '/items/placeholder.jpg';
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={getItemImageSrc()}
          alt={item.productDisplayName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-white rounded-full py-1 px-2 text-xs font-medium">
            Match
          </div>
          
          {item.matchReason && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded-full p-1 cursor-help">
                    <InfoIcon className="h-4 w-4 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{item.matchReason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-medium text-sm line-clamp-1">{item.productDisplayName}</h4>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-bold">${price.toFixed(2)}</span>
          <Button variant="ghost" size="sm" icon={<ShoppingBag className="h-4 w-4" />}>
            Add
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {item.gender} | {item.masterCategory} | {item.usage || item.articleType}
        </p>
      </CardContent>
    </Card>
  );
};

export default RecommendationResults;
