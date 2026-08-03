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
    <div className="group relative h-[21rem] w-[16.5rem] flex-shrink-0 overflow-hidden rounded-[2rem] border border-purple-100/70 shadow-[0_25px_60px_-35px_rgba(76,29,149,0.45)]">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized
      />
      <div className="absolute inset-0 bg-linear-to-t from-indigo-950 via-primary/70 to-transparent opacity-90"></div>
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/15 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="max-w-[12rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Graduate story
          </p>
          <h3 className="mt-3 text-3xl font-bold leading-none text-white">Placed</h3>
          <h3 className="text-3xl font-bold leading-none text-white">as</h3>
          <p className="mt-3 line-clamp-2 text-base font-medium text-white/85">{position}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-sm backdrop-blur-sm">
            <Image
              src={companyLogo}
              alt={company}
              width={48}
              height={48}
              className="max-h-full w-auto rounded-lg object-contain"
              unoptimized
            />
          </div>

          <div className="rounded-full bg-white px-4 py-2 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
