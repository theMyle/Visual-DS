import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
