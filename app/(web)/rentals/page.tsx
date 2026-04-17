import RentalFilters from "@/components/rental/rental-filters";
import RentalSection from "@/components/rental/rental-section";
import React from "react";

const RentalsPage = () => {
  return (
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Louez une voiture
          </h1>
          <p className="text-gray-600 mt-2">
            Trouvez le véhicule idéal pour votre prochaine aventure
          </p>
        </div>

        <div className="grid grid-cols-1 items-start justify-stretch lg:grid-cols-[280px_1fr] gap-5">
          <div className="pt-1 sticky top-20">
            <RentalFilters />
          </div>
          <div className="pt-1">
            <RentalSection />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RentalsPage;
