import Image from 'next/image';

export const CustomImage = () => {
  return (
    <div className="relative w-full h-64">
      <Image
        src="/assets/logo.svg"
        alt="Custom image"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

