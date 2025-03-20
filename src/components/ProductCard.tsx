
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle, Heart } from 'lucide-react';
import { staggeredAnimation } from '@/utils/animations';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageSrc: string;
  index: number;
  isVisible: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  category,
  imageSrc,
  index,
  isVisible
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <div
      className={cn(
        'group relative rounded-lg overflow-hidden transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={staggeredAnimation(index, 100)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-1 aspect-h-1 bg-secondary/20 rounded-lg overflow-hidden">
        <div className="relative h-full w-full">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={name}
            className={cn(
              'h-full w-full object-cover transition-all duration-700',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              isHovered ? 'scale-105' : 'scale-100'
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div 
          className={cn(
            'absolute inset-0 bg-black/5 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
        
        <div className="absolute top-3 right-3">
          <button 
            className={cn(
              'p-2 rounded-full transition-all duration-300 bg-white/80 backdrop-blur-md hover:bg-white',
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            )}
            style={{ transitionDelay: `${50}ms` }}
          >
            <Heart className="h-4 w-4 text-gray-700" />
          </button>
        </div>
        
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4 transition-all duration-300',
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          <button 
            className="w-full py-2 px-4 bg-white/90 backdrop-blur-md hover:bg-white rounded-md text-sm font-medium text-gray-900 transition-colors flex items-center justify-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm font-medium text-gray-900">${price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
