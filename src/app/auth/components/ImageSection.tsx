import React from 'react';
import Image from 'next/image';

const ImageSection: React.FC = () => (
  <div className="relative w-full max-w-2xl lg:max-w-3xl aspect-video mb-6 overflow-hidden rounded-2xl">
   <Image
      src="/sign.png"
      alt="Authentication"
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
      className="object-contain"
    />
  </div>
);

export default ImageSection;
