import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qnotowwaqpnshffwwzrf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'acdn-us.mitiendanube.com', // Mantén este si aún lo necesitas
      },
    ],
  },
};

export default nextConfig;