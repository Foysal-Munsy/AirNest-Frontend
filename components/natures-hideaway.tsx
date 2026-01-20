import Image from "next/image";
import { Star } from "lucide-react";

export default function NaturesHideaway() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.pexels.com/photos/4620520/pexels-photo-4620520.jpeg"
        alt="Nature's Perfect Hideaway"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 bg-linear-to-b from-black/20 via-transparent to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 container mx-auto px-4 py-12 md:py-24 flex flex-col justify-between">
        {/* Top Section - Title */}
        <div className="max-w-2xl mt-12 md:mt-0">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-tight tracking-tight">
            Nature&apos;s <br />
            Perfect <br />
            Hideaways
          </h2>
        </div>

        {/* Bottom Section - Description and Rating */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8 md:mb-12">
          <div className="max-w-md space-y-4">
            <p className="text-lg text-gray-200 leading-relaxed">
              Discover handpicked luxury cabins in breathtaking locations.
              Unplug, unwind, and reconnect with what matters most.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-semibold">4.7</span>
            <span className="text-gray-300 ml-1">from 1,800+ stays</span>
          </div>
        </div>
      </div>
    </section>
  );
}
