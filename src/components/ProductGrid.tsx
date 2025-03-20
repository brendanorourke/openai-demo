
import React from 'react';
import ProductCard from './ProductCard';
import { useIntersectionObserver } from '@/utils/animations';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageSrc: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Mark Taylor Men Striped Blue Shirt',
    price: 79.99,
    category: 'Shirts',
    imageSrc: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&auto=format&q=80'
  },
  {
    id: '2',
    name: 'Flying Machine Men Yellow Polo Tshirts',
    price: 49.99,
    category: 'T-shirts',
    imageSrc: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&q=80'
  },
  {
    id: '3',
    name: 'U.S. Polo Assn. Men Checks Maroon Shirt',
    price: 89.99,
    category: 'Shirts',
    imageSrc: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=500&auto=format&q=80'
  },
  {
    id: '4',
    name: 'Fabindia Men Blue Kurta',
    price: 69.99,
    category: 'Ethnic Wear',
    imageSrc: 'https://images.unsplash.com/photo-1591196131584-c0e462e4b17a?w=500&auto=format&q=80'
  },
  {
    id: '5',
    name: 'Fitted White Women\'s T-shirt',
    price: 39.99,
    category: 'T-shirts',
    imageSrc: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&q=80'
  },
  {
    id: '6',
    name: 'Women\'s Black Skinny Jeans',
    price: 89.99,
    category: 'Jeans',
    imageSrc: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500&auto=format&q=80'
  },
  {
    id: '7',
    name: 'White Canvas Sneakers',
    price: 59.99,
    category: 'Footwear',
    imageSrc: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&auto=format&q=80'
  },
  {
    id: '8',
    name: 'Men\'s Black Leather Belt',
    price: 45.99,
    category: 'Accessories',
    imageSrc: 'https://images.unsplash.com/photo-1600385546605-536b691ed162?w=500&auto=format&q=80'
  }
];

const ProductGrid = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section 
      id="products" 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-secondary rounded-full text-xs font-medium mb-4 tracking-wide">
            OUR COLLECTION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of trending items, personally recommended by our AI assistant
            based on current fashion trends and user preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              imageSrc={product.imageSrc}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
