import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'red-decisive-ocelot-227.mypinata.cloud',
      },
    ],
  },

};

export default nextConfig;
