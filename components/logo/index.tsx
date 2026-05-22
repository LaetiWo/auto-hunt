import { CarFront } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative size-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
        <CarFront className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="font-extrabold text-xl tracking-tighter text-foreground">
          AUTO<span className="text-primary">HUNT</span>
        </span>
        {/* <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase pl-0.5">
          Premium Market
        </span> */}
      </div>
    </Link>
  );
};

export default Logo;
