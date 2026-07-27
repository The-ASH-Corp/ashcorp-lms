import Image, { StaticImageData } from 'next/image';

interface GraduateCardProps {
  name: string;
  position: string;
  company: string;
  companyLogo: string | StaticImageData;
  image: string | StaticImageData;
}

export default function GraduateCard({
  name,
  position,
  company,
  companyLogo,
  image,
}: GraduateCardProps) {
  return (
    <div className="relative h-96 rounded-2xl overflow-hidden flex-shrink-0 w-72 group">
      {/* Background Image */}

      {/* Violet Gradient Overlay - Left Side */}
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover "
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-transparent opacity-30"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top Section */}
        <div>
          <h3 className="text-white text-3xl font-bold">Placed</h3>
          <h3 className="text-white text-3xl font-bold">as</h3>
          <p className="text-white text-lg font-medium mt-2">{position}</p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Company Logo */}
          <div className="bg-transparent rounded-lg  w-16 h-16 flex items-center justify-center flex-shrink-0">
            <Image
              src={companyLogo}
              alt={company}
              width={48}
              height={48}
              className=" object-cover rounded-lg"
              unoptimized
            />
          </div>

          {/* Name Badge */}
          <div className="bg-white rounded-full px-4 py-2">
            <p className="text-gray-900 font-semibold text-sm">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
