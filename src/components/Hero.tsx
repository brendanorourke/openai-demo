import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '@/utils/animations';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="container mx-auto px-4 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div 
            className={`max-w-xl ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '200ms' }}
          >
            <span className="inline-block py-1 px-3 bg-secondary rounded-full text-xs font-medium mb-6 tracking-wide">
              REVOLUTIONARY SHOPPING
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Personal Shopping Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our AI-powered assistant analyzes your style preferences and recommends perfect outfit combinations for any occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/try-now">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Try Now
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          <div 
            className={`relative ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '400ms' }}
          >
            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden bg-secondary/20">
                <img
                  ref={imageRef}
                  src="https://images.unsplash.com/photo-1519722417352-7d6959729417?auto=format&q=80"
                  alt="Fashion outfit"
                  className={`object-cover w-full h-full transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-2/3">
                <div className={`relative rounded-2xl overflow-hidden glass-effect p-4 transform ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Smart Recommendations</h3>
                      <p className="text-xs text-gray-600 mt-1">AI-powered fashion advice based on your style</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-80 pointer-events-none"></div>
      
      <div className="absolute -top-[30%] -right-[20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
