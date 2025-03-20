
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';

const Index = () => {
  // Page transition effect
  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.add('page-loaded');
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  return (
    <Layout>
      <Hero />
      <ProductGrid />
      
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block py-1 px-3 bg-white rounded-full text-xs font-medium mb-4 tracking-wide">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Smart Shopping, Simplified</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Upload Reference</h3>
                <p className="text-sm text-gray-600">Share an image of a style you want to complement.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">Our AI assistant analyzes the image for style, category, and color.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Get Recommendations</h3>
                <p className="text-sm text-gray-600">Receive personalized outfit suggestions that match your style.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-secondary/20">
                <img
                  src="https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&q=80"
                  alt="AI Fashion Analysis"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <span className="inline-block py-1 px-3 bg-secondary rounded-full text-xs font-medium mb-4 tracking-wide">
                ADVANCED TECHNOLOGY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powered by AI Vision</h2>
              <p className="text-gray-600 mb-8">
                Our state-of-the-art AI technology analyzes clothing items with precision, identifying 
                subtle details in style, cut, pattern, and color to create perfect outfit combinations.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Style and category recognition',
                  'Color palette analysis',
                  'Seasonal appropriateness',
                  'Trend awareness',
                  'Personal preference learning'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of fashion enthusiasts who have discovered the perfect outfit combinations with our AI assistant.
          </p>
          <button className="inline-flex items-center justify-center py-3 px-6 bg-white text-primary font-medium rounded-md hover:bg-white/90 transition-colors">
            Get Started Now
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
