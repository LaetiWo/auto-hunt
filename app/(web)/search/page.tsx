import React from "react";
import SearchContent from "./_components/search-content";

export const dynamic = "force-dynamic";

const SearchPage = () => {
  return (
    <main className="w-full px-4 pt-3 pb-8">
      <div className="max-w-[1600px] w-full flex items-start justify-start text-start">
        <SearchContent />
      </div>
    </main>
  );
};

export default SearchPage;
