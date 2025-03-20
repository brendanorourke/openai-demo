
import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, ImageIcon } from 'lucide-react';
import Button from '@/components/Button';
import { UploadedImage } from '@/types/recommendation';

interface UploadStepProps {
  onImageUpload: (image: UploadedImage) => void;
  isLoading: boolean;
}

const UploadStep: React.FC<UploadStepProps> = ({ onImageUpload, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('👆 User selected a file via file input');
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    console.log('🖼️ Processing file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      console.error('❌ File is not an image:', file.type);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      console.log('✅ File converted to data URL successfully');
      setPreviewUrl(dataUrl);
      setUploadedImage({ dataUrl, file });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      console.log('🖱️ User dragging file over drop zone');
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      console.log('🖱️ User dragged file out of drop zone');
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    console.log('🖱️ User dropped file');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    console.log('👆 User clicked to browse for files');
    inputRef.current?.click();
  };

  const handleSubmit = () => {
    if (uploadedImage) {
      console.log('👆 User submitted image for analysis', {
        fileName: uploadedImage.file.name,
        fileType: uploadedImage.file.type,
        fileSize: `${(uploadedImage.file.size / 1024).toFixed(2)} KB`
      });
      onImageUpload(uploadedImage);
    }
  };

  return (
    <div className="space-y-8">
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        } ${previewUrl ? 'bg-black/5' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={previewUrl ? undefined : triggerFileInput}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Click "Analyze" to get recommendations
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-12">
            <div className="w-16 h-16 mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload an Image</h3>
            <p className="text-gray-500 mb-4 max-w-xs">
              Drag and drop your image here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {previewUrl ? (
          <div className="space-x-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setPreviewUrl(null);
                setUploadedImage(null);
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isLoading}
              icon={isLoading ? undefined : <ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            onClick={triggerFileInput}
            icon={<Upload className="h-5 w-5" />}
          >
            Upload Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadStep;
