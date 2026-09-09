"use client";

import dynamic from "next/dynamic";

const SafiLocationMap = dynamic(() => import("./SafiLocationMap"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full animate-pulse bg-[#e8e1d4]" aria-label="Chargement de la carte" />,
});

export default SafiLocationMap;
