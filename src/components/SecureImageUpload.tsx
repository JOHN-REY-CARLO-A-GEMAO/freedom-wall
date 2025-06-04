import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import CryptoJS from 'crypto-js';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import devtools from 'devtools-detector';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SecureImageUploadProps {
  onUpload: (url: string) => void;
  maxSize?: number; // in MB
}

const SecureImageUpload: React.FC<SecureImageUploadProps> = ({ 
  onUpload, 
  maxSize = 10 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Anti-screenshot and security measures
  useEffect(() => {
    // Disable print screen
    const handlePrintScreen = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    };

    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block developer tools
    const handleDevTools = () => {
      if (devtools.isOpen) {
        window.location.href = '/blocked';
      }
    };

    document.addEventListener('keydown', handlePrintScreen);
    document.addEventListener('contextmenu', handleContextMenu);
    const devToolsInterval = setInterval(handleDevTools, 1000);

    return () => {
      document.removeEventListener('keydown', handlePrintScreen);
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(devToolsInterval);
    };
  }, []);

  // Image compression options
  const compressionOptions = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  // Add watermark to image
  const addWatermark = async (image: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Add invisible watermark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
          ctx.font = '20px Arial';
          const timestamp = Date.now();
          const watermark = `Protected ${timestamp}`;
          ctx.fillText(watermark, 20, 20);

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/webp', 0.9);
        }
      };

      img.src = URL.createObjectURL(image);
    });
  };

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError(null);
      setIsUploading(true);

      const file = acceptedFiles[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Compress image
      const compressedFile = await imageCompression(file, compressionOptions);

      // Add watermark
      const watermarkedBlob = await addWatermark(compressedFile);

      // Create preview
      const previewUrl = URL.createObjectURL(watermarkedBlob);
      setPreview(previewUrl);

      // Encrypt file name
      const encryptedName = CryptoJS.SHA256(file.name + Date.now()).toString();
      const fileExt = file.name.split('.').pop();
      const fileName = `${encryptedName}.${fileExt}`;

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, watermarkedBlob, {
          cacheControl: '3600',
          contentType: 'image/webp'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${preview ? 'border-solid' : 'border-dashed'}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-sm text-gray-500">Processing image...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {isDragActive ? (
              <Upload className="h-12 w-12 text-purple-500" />
            ) : (
              <ImageIcon className="h-12 w-12 text-gray-400" />
            )}
            <p className="text-base text-gray-600">
              {isDragActive
                ? 'Drop your image here'
                : 'Drag & drop an image, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WebP up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SecureImageUpload;