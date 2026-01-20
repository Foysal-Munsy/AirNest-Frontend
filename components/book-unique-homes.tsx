import Image from "next/image";

export default function BookUniqueHomes() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Book unique homes and experience
          </h1>
          <p className="text-lg text-gray-500 max-w-lg">
            Unforgettable travel experiences start with right now. Find
            adventures and new places with Airbnb. Rent unique places to stay
            from local hosts in 190+ countries.
          </p>
          <div className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Earn money <span className="text-red-500">renting</span> on Airbnb{" "}
            <span className="text-red-500">&gt;</span>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden">
          <Image
            src="https://instantrain.co.uk/wp-content/uploads/2021/03/House-on-Hill-2-640x620.jpg"
            alt="Unique home on a hill"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
