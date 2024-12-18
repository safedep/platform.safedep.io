import React from 'react';
import Image from 'next/image';

const ImageSection: React.FC = () => (
  <div className="w-full max-w-lg  aspect-video mb-6 overflow-hidden rounded-2xl ">
    <Image
      src="/pre-auth.svg"
      alt="Authentication illustration"
      width={800}
      height={450}
      className="object-cover w-full h-full "
    />
  </div>
);

export default ImageSection;
